import React, { Component, lazy, Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
    Badge,
    Button,
    ButtonDropdown,
    ButtonGroup,
    ButtonToolbar,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Progress,
    Row,
    Table,
} from 'reactstrap';

const Main = React.memo(function Main(props) {
    const [RegisList, setRegisList] = useState([]);
    const [RegisTotal, setRegisTotal] = useState(0);
    const [IncomeList, setIncomeList] = useState([]);
    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
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
                    beginDate: new Date(today.getTime() - 8 * 86400000).toUTCString(),
                    endDate: today.toUTCString(),
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
                    endDate: today.toUTCString(),
                }
            })
            .then((response) => {
                let sorted = response.data.slice(0).sort(function (a, b) {
                    if (a.startDate === b.startDate) return 0;
                    return (a.startDate > b.startDate) ? -1 : 1;
                });
                setIncomeList(sorted);
            }).catch(() => {
                props.history.push('/login');
            });
    }
    const groupBy = (items, key) => items.reduce(
        (result, item) => ({
            ...result,
            [item[key]]: [
                ...(result[item[key]] || []),
                item,
            ],
        }),
        {},
    );
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
                                        <Col md="3">
                                            <Card key={i} className="card-accent-primary">
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
            {/* <Row>
                <Card>
                    <CardBody>
                        qwkjdlkjklwe
                        {!IncomeList.map(x => x.amount) && IncomeList.map(x => x.amount).reduce((ori, added) => ori + added)}

                    </CardBody>
                </Card>
            </Row> */}
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-tasks"> 業績</i>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                {IncomeList.map((d, i) => {
                                    return (
                                        <Col md="3">
                                            <Card key={i}>
                                                <CardHeader>{d.startDate} 業績</CardHeader>
                                                <CardBody>$ {d.amount}</CardBody>
                                            </Card>
                                        </Col>)
                                })}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
});

export default Main;