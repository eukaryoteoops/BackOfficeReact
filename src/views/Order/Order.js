import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { DateRangePicker } from 'react-date-range';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            total: 0,
            activePage: 1,
            formData: {
                nickName: '',
                code: '',
                method: '',
                item: '',
                startDate: new Date(),
                endDate: new Date(),
                status: 4
            }
        };
    }

    getOrderList = () => {
        // let self = this;
        let token = localStorage.getItem('token');
        axios.get('http://uat.bo.snf.today/BrandPlatform/Order',
            {
                headers: { "Authorization": `Bearer ${token}` },
                params: {
                    nickName: this.state.formData.nickName,
                    channelName: this.state.formData.code,
                    paymethodId: this.state.formData.method,
                    productId: this.state.formData.item,
                    beginDate: this.state.formData.startDate,
                    endDate: this.state.formData.endDate,
                    pageNo: this.state.activePage,
                    pageSize: 20,
                    status: this.state.formData.status
                }
            })
            .then((response) => {
                this.setState({
                    list: response.data.dataList,
                    total: response.data.amount
                });
                window.scrollTo(0, 480);
            }).catch(() => {
                this.props.history.push('/login');
            });
    }


    handlePageChange = (e) => {
        this.setState({
            activePage: e
        }, () => { this.getOrderList() })

    }

    handleDatePick = (ranges) => {
        this.setState({
            formData: { ...this.state.formData, startDate: ranges.selection.startDate, endDate: ranges.selection.endDate }
        })
    }

    handleInputChange = (event) => {
        event.persist();
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            formData: { ...this.state.formData, [name]: value }
        });
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col md="6">
                        <FormGroup className="pr-1" row>
                            <Col md="2"><Label htmlFor="nickName" className="pr-1">會員暱稱</Label></Col>
                            <Col md="10"><Input name="nickName" type="text" placeholder="王小明..." onChange={this.handleInputChange} /></Col>
                        </FormGroup>
                        <FormGroup className="pr-1" row>
                            <Col md="2"><Label htmlFor="code" className="pr-1">金流代號</Label></Col>
                            <Col md="10"><Input name="code" type="text" placeholder="BeeBuy..." onChange={this.handleInputChange} /></Col>
                        </FormGroup>
                        <FormGroup className="pr-1" row>
                            <Col md="2"><Label htmlFor="method" className="pr-1">購買方式</Label></Col>
                            <Col md="10"><Input name="method" type="text" placeholder="微信..." onChange={this.handleInputChange} /></Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="2">
                                <Label htmlFor="item">購買項目</Label>
                            </Col>
                            <Col md="10">
                                <Input type="select" name="item" onChange={this.handleInputChange}>
                                    <option value="0">請選擇</option>
                                    <option value="1">One Time</option>
                                    <option value="2">Discount</option>
                                    <option value="3">Download</option>
                                    <option value="4">PayBack</option>
                                    <option value="5">VIP</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="2">
                                <Label htmlFor="status">購買狀態</Label>
                            </Col>
                            <Col md="10">
                                <Input type="select" name="status" onChange={this.handleInputChange} defaultValue="4">
                                    <option value="0">初始中</option>
                                    <option value="1">處理中</option>
                                    <option value="2">已支付</option>
                                    <option value="3">異常</option>
                                    <option value="4">已完成</option>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup row>
                            <Col md="2">
                                <Label htmlFor="range">購買區間</Label>
                            </Col>
                            <Col md="10">
                                <DateRangePicker
                                    ranges={[{
                                        startDate: this.state.formData.startDate,
                                        endDate: this.state.formData.endDate,
                                        key: 'selection',
                                    }]}
                                    onChange={this.handleDatePick}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col className="text-center">
                        <FormGroup>
                            <Button className="align-items-center" size="lg" color="primary" onClick={this.getOrderList}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> 訂單查詢
                            </CardHeader>
                            <CardBody>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th>項次</th>
                                            <th>會員暱稱</th>
                                            <th>金流代號</th>
                                            <th>購買方式</th>
                                            <th>購買金額</th>
                                            <th>購買項目</th>
                                            <th>交易編號</th>
                                            <th>金流編號</th>
                                            <th>購買時間</th>
                                            <th>狀態</th>
                                            <th>購買域名</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.list.map((data, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{data.nickName}</td>
                                                    <td>{data.paymethodName}</td>
                                                    <td>{data.channelName}</td>
                                                    <td>{data.amount}</td>
                                                    <td>{data.productName}</td>
                                                    <td>{data.orderId}</td>
                                                    <td>{data.outOrderId}</td>
                                                    <td>{new Date(data.purchasedDate * 1000).toLocaleString()}</td>
                                                    <td>{data.status}</td>
                                                    <td>{data.purchasedDomain}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                <Pagination
                                    hideDisabled
                                    pageRangeDisplayed={10}
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={20}
                                    totalItemsCount={this.state.total}
                                    onChange={this.handlePageChange}
                                    linkClass={'page-link'}
                                    itemClass={'page-item'}
                                    innerClass={'pagination justify-content-center'}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default Order;