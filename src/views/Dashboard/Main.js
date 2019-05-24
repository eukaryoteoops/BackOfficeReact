import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, Col, Row, } from 'reactstrap';

const Main = React.memo(function Main(props) {
    const [RegisList, setRegisList] = useState([]);
    const [RegisTotal, setRegisTotal] = useState(0);
    const [IncomeList, setIncomeList] = useState([]);

    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    let yesterday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1);
    let StartDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    let EndDateOfThisMonth = new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).setDate(0));
    let StartDateOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    let EndDateOfLastMonth = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1).setDate(0));
    let StartDateOfThisWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay());
    let EndDateOfThisWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6 - new Date().getDay());
    let StartDateOfLastWeek = new Date(new Date(StartDateOfThisWeek).setDate(new Date(StartDateOfThisWeek).getDate() - 7));
    let EndDateOfLastWeek = new Date(new Date(EndDateOfThisWeek).setDate(new Date(EndDateOfThisWeek).getDate() - 7));


    useEffect(() => {
        getRegistration();
        getIncome();
    }, []);

    const getRegistration = () => {
        let token = localStorage.getItem('token');
        axios.get('http://uat.bo.snf.today/BrandPlatform/Member/DailyRegistration',
            {
                headers: { "Authorization": `Bearer ${token}` },
                params: {
                    beginDate: new Date(today.getTime() - 7 * 86400000).toUTCString(),
                    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toUTCString(),
                }
            })
            .then((response) => {
                setRegisTotal(response.data.totalAmount);
                let sorted = response.data.dataList.slice(0).sort(function (a, b) {
                    if (a.item1 === b.item1) return 0;
                    return (a.item1 > b.item1) ? -1 : 1;
                });
                setRegisList(sorted);
            }).catch(() => {
                props.history.push('/login');
            });
    }
    const getIncome = () => {
        let token = localStorage.getItem('token');
        axios.get('http://uat.bo.snf.today/BrandPlatform/Order/DailyIncome',
            {
                headers: { "Authorization": `Bearer ${token}` },
                params: {
                    beginDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toUTCString(),
                    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toUTCString(),
                }
            })
            .then((response) => {

                let sorted = response.data;
                sorted.forEach(e => {
                    e.startDate = `${e.startDate.substr(4, 2)}/${e.startDate.substr(6.2)}/${e.startDate.substr(0, 4)}`;
                });
                setIncomeList(sorted);
            }).catch(() => {
                props.history.push('/login');
            });
    }

    return (
        <div className="animated fadeIn">
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-child"> 會員數</i>
                        </CardHeader>
                        <CardBody>
                            {<Row>
                                <Col md="3">
                                    <Card className="border-primary">
                                        <CardHeader>總會員數</CardHeader>
                                        <CardBody>{RegisTotal}</CardBody>
                                    </Card>
                                </Col>
                            </Row>}
                            <Row>
                                {RegisList.map((d, i) => {
                                    return (
                                        <Col md="3" key={i}>
                                            <Card className="card-accent-primary">
                                                <CardHeader>{d.item1} 會員數</CardHeader>
                                                <CardBody>{d.item2}</CardBody>
                                            </Card>
                                        </Col>)
                                })}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-tasks"> 業績</i>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="3">
                                    <Card>
                                        <CardHeader>當日業績</CardHeader>
                                        <CardBody>$ {IncomeList.filter((item, index) => {
                                            return new Date(item.startDate).toString() == today.toString()
                                        }).reduce((a, b) => a + b.amount, 0)}</CardBody>
                                    </Card>
                                </Col>
                                <Col md="3">
                                    <Card>
                                        <CardHeader>昨日業績</CardHeader>
                                        <CardBody>$ {IncomeList.filter((item, index) => {
                                            return new Date(item.startDate).toString() == yesterday.toString()
                                        }).reduce((a, b) => a + b.amount, 0)}</CardBody>
                                    </Card>
                                </Col>
                                <Col md="3">
                                    <Card>
                                        <CardHeader>本周業績</CardHeader>
                                        <CardBody>$ {IncomeList.filter((item, index) => {
                                            return new Date(item.startDate) >= StartDateOfThisWeek
                                                && new Date(item.startDate) <= EndDateOfThisWeek
                                        }).reduce((a, b) => a + b.amount, 0)}</CardBody>
                                    </Card>
                                </Col>
                                <Col md="3">
                                    <Card>
                                        <CardHeader>上週業績</CardHeader>
                                        <CardBody>$ {IncomeList.filter((item, index) => {
                                            return new Date(item.startDate) >= StartDateOfLastWeek
                                                && new Date(item.startDate) <= EndDateOfLastWeek
                                        }).reduce((a, b) => a + b.amount, 0)}</CardBody>
                                    </Card>
                                </Col>
                                <Col md="3">
                                    <Card>
                                        <CardHeader>本月業績</CardHeader>
                                        <CardBody>$ {IncomeList.filter((item, index) => {
                                            return new Date(item.startDate) >= StartDateOfThisMonth
                                                && new Date(item.startDate) <= EndDateOfThisMonth
                                        }).reduce((a, b) => a + b.amount, 0)}</CardBody>
                                    </Card>
                                </Col>
                                <Col md="3">
                                    <Card>
                                        <CardHeader>上月業績</CardHeader>
                                        <CardBody>$ {IncomeList.filter((item, index) => {
                                            return new Date(item.startDate) >= StartDateOfLastMonth
                                                && new Date(item.startDate) <= EndDateOfLastMonth
                                        }).reduce((a, b) => a + b.amount, 0)}</CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
});

export default Main;