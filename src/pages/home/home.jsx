import React, { Component } from 'react';
import './home.less'
import { Carousel } from 'antd';
import { Calendar, Select, Radio, Col, Row, Typography, Card } from 'antd';

import { Statistic, } from 'antd';



function onPanelChange(value, mode) {
    console.log(value, mode);
}

function onFinish() {
    console.log('finished!');
}

function onChange(val) {
    if (4.95 * 1000 < val && val < 5 * 1000) {
        console.log('changed!');
    }
}
class Home extends Component {


    render() {

        const { Countdown } = Statistic;
        const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK


        return (



            <div>

                <Carousel autoplay className='main-content'>
                    <div className="carousel1">
                        <h3>Welcome to Hunter Content Management System</h3>
                    </div>
                    <div className="carousel2">
                        <h3>2</h3>
                    </div>
                    <div className="carousel3">
                        <h3>3</h3>
                    </div>

                </Carousel>


                <div style={{ float: "right" }}>
                    <Calendar
                        className="calendar"
                        fullscreen={false}
                        headerRender={({ value, type, onChange, onTypeChange }) => {
                            const start = 0;
                            const end = 12;
                            const monthOptions = [];

                            const current = value.clone();
                            const localeData = value.localeData();
                            const months = [];
                            for (let i = 0; i < 12; i++) {
                                current.month(i);
                                months.push(localeData.monthsShort(current));
                            }

                            for (let index = start; index < end; index++) {
                                monthOptions.push(
                                    <Select.Option className="month-item" key={`${index}`}>
                                        {months[index]}
                                    </Select.Option>,
                                );
                            }
                            const month = value.month();

                            const year = value.year();
                            const options = [];
                            for (let i = year - 10; i < year + 10; i += 1) {
                                options.push(
                                    <Select.Option key={i} value={i} className="year-item">
                                        {i}
                                    </Select.Option>,
                                );
                            }
                            return (
                                <div style={{ padding: 8 }}>
                                    <Typography.Title level={4}>Calendar</Typography.Title>
                                    <Row gutter={8}>
                                        <Col>
                                            <Radio.Group size="small" onChange={e => onTypeChange(e.target.value)} value={type}>
                                                <Radio.Button value="month">Month</Radio.Button>
                                                <Radio.Button value="year">Year</Radio.Button>
                                            </Radio.Group>
                                        </Col>
                                        <Col>
                                            <Select
                                                size="small"
                                                dropdownMatchSelectWidth={false}
                                                className="my-year-select"
                                                onChange={newYear => {
                                                    const now = value.clone().year(newYear);
                                                    onChange(now);
                                                }}
                                                value={String(year)}
                                            >
                                                {options}
                                            </Select>
                                        </Col>
                                        <Col>
                                            <Select
                                                size="small"
                                                dropdownMatchSelectWidth={false}
                                                value={String(month)}
                                                onChange={selectedMonth => {
                                                    const newValue = value.clone();
                                                    newValue.month(parseInt(selectedMonth, 10));
                                                    onChange(newValue);
                                                }}
                                            >
                                                {monthOptions}
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        }}
                        onPanelChange={onPanelChange}
                    />
                </div>

                <div>
                    <Card className="countdown">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Countdown title="Countdown" value={deadline} onFinish={onFinish} />
                            </Col>
                            <Col span={12}>
                                <Countdown title="Million Seconds" value={deadline} format="HH:mm:ss:SSS" />
                            </Col>
                            <Col span={24} style={{ marginTop: 32 }}>
                                <Countdown title="Day Level" value={deadline} format="D : H : m : s" />
                            </Col>
                            <Col span={12}>
                                <Countdown title="Countdown" value={Date.now() + 10 * 1000} onChange={onChange} />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div >

        )
    }
}

export default Home;