import React from 'react';
import {IMovieState} from "../redux/reducers/MovieReducer";
import {Button, message, Popconfirm, Switch, Table} from 'antd';
import {IMovie} from "../services/MovieService";
import {ColumnProps, TablePaginationConfig} from "antd/lib/table";
import defaultPosterImg from '../assets/na.png';
import {SwitchType} from "../services/CommonTypes";
import {NavLink} from "react-router-dom";
import {PaginationConfig} from "antd/lib/pagination";

export interface IMovieEvent {
    onLoad(): void,

    onSwitchChange(
        kind: SwitchType,
        newState: boolean,
        id: string,
    ): void,

    onDelete(id: string): Promise<void>,

    onChange(page: number): void,
}

export default class extends React.Component<IMovieState & IMovieEvent> {
    componentDidMount() {
        if (this.props.onLoad) {
            this.props.onLoad();
        }
    }

    private getColumns(): ColumnProps<IMovie>[] {
        return [
            {
                title: 'poster',
                dataIndex: 'poster',
                render(poster: string) {
                    return poster ? <img className='tablePoster' src={poster}/> :
                        <img className='tablePoster' src={defaultPosterImg}/>;
                },
            },
            {
                title: 'name',
                dataIndex: 'name',
            },
            {
                title: 'areas',
                dataIndex: 'areas',
                render: (areas: string[]) => {
                    return areas.join('，');
                },
            },
            {
                title: 'kind',
                dataIndex: 'types',
                render(types: string[]) {
                    return types.join('，');
                },
            },
            {
                title: 'timeLong',
                dataIndex: 'timeLong',
                render(timeLong: number) {
                    return timeLong + ' Minutes';
                }
            },
            {
                title: 'isHot',
                dataIndex: 'isHot',
                render: (isHot: boolean, record) => {
                    return <Switch defaultChecked={isHot} onChange={(checked: boolean) => {
                        this.props.onSwitchChange(SwitchType.isHOt, checked, record._id!);
                    }}/>
                }
            },
            {
                title: 'isComing',
                dataIndex: 'isComing',
                render: (isComing: boolean, record: IMovie) => {
                    return <Switch defaultChecked={isComing} onChange={(checked) => {
                        this.props.onSwitchChange(SwitchType.isComing, checked, record._id!);
                    }}/>
                }
            },
            {
                title: 'isClassic',
                dataIndex: 'isClassic',
                render: (isClassic: boolean, record) => {
                    return <Switch defaultChecked={isClassic} onChange={(checked) => {
                        this.props.onSwitchChange(SwitchType.isClassic, checked, record._id!);
                    }}/>
                }
            },
            {
                title: 'operate',
                dataIndex: '_id',
                render: (id: string, record) => {
                    return <div>
                        <NavLink to={'/movie/edit/' + id}>
                            <Button type='primary' size='small'>edit</Button>
                        </NavLink>
                        <Popconfirm title='Are you sure delete this task?'
                                    onConfirm={async () => {
                                        await this.props.onDelete(id);
                                        message.success('delete success');
                                    }}
                                    okText='sure'
                                    cancelText='cancel'
                        >
                            <Button type='link'>delete</Button>
                        </Popconfirm>
                    </div>;
                },
            },
        ];
    }

    getPageConfig(): false | TablePaginationConfig {
        if (this.props.total == 0) {
            return false;
        }
        return {
            current: this.props.condition.page,
            pageSize: this.props.condition.limit,
            total: this.props.total,
        };
    }

    handleChange(pagination: TablePaginationConfig) {
        const current = pagination.current;
        this.props.onChange(current!);
    }

    render() {
        return (
            <Table
                rowKey='_id'
                dataSource={this.props.data}
                columns={this.getColumns()}
                pagination={this.getPageConfig()}
                onChange={this.handleChange.bind(this)}
                loading={this.props.isLoading}
            />
        );
    }
}