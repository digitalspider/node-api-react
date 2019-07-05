import React, {Component} from 'react';
import {toJS} from 'mobx';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import DataRow from './DataRow';
import _ from 'lodash';
import {withStyles} from '@material-ui/core/styles';
import {CSVLink} from 'react-csv';

const styles = (theme) => ({
  root: {
    overflowX: 'auto',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  csvLink: {
    color: '#a4a4a4',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 400,
    fontFamily: theme.typography.fontFamily,
  },
});

class DataTable extends Component {
  constructor(props) {
    super(props);
    const headers = props.headers.map((header) => {
      return {
        'id': _.camelCase(header),
        'name': header,
      };
    });

    this.state = {
      data: [],
      dataToDownload: [],
      page: 0,
      rowsPerPage: 10,
      orderBy: 'createdDate',
      order: 'desc',
      headers: headers,
      paginate: props.paginateAlways || false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  /**
   * Load property data into the state
   * and setup paginate.
   */
  getData() {
    let data = toJS(this.props.data);
    this.setState({data: data});
    this.setState({paginate:
      this.state.paginate || this.state.data.length > this.state.rowsPerPage});
  };

  /* Case insensitive/natural order sorting  */
  sortData(data, orderBy, order) {
    return _.orderBy(
        data,
      orderBy === 'createdDate'
        ? orderBy
        : [(data) => data[orderBy].toLowerCase()],
      order
    );
  };

  createSortEvent = (property) => (event) => {
    // Can't sort the actions column
    if (property === 'actions') {
      return;
    }

    const orderBy = property;
    let order = 'asc';

    if (this.state.orderBy === property) {
      order = this.state.order === 'desc' ? order : 'desc';
    }

    const data = this.sortData(this.state.data, orderBy, order);
    this.setState({data, order, orderBy});
  };

  handleChangePage(event, page) {
    this.setState({page});
  };

  handleChangeRowsPerPage(event) {
    this.setState({rowsPerPage: event.target.value});
  };

  render() {
    const {classes} = this.props;
    const {
      data,
      page,
      rowsPerPage,
      orderBy,
      order,
      dataToDownload,
      headers,
      paginate,
    } = this.state;

    return (
      <React.Fragment>
        <Typography variant="h6" className={classes.title}>
          {this.props.title}
        </Typography>
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => {
                  return (
                    <TableCell
                      key={header.id}
                      sortDirection={orderBy === header.id ? order : false}
                    >
                      <Tooltip title="Sort" enterDelay={300}>
                        <TableSortLabel
                          active={orderBy === header.id}
                          direction={order}
                          onClick={this.createSortEvent(header.id)}
                        >
                          {header.name}
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                  .slice(page * rowsPerPage, (page+1) * rowsPerPage)
                  .map((item) => (
                    <DataRow
                      key={item.id}
                      data={item}
                      isEditable={true}
                    />
                  ))}
            </TableBody>
          </Table>
          {paginate &&
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />}
        </Paper>
        {dataToDownload.length>0 &&
        <CSVLink
          className={classes.csvLink}
          data={dataToDownload}
          onClick={this.getCsvData}
          filename={this.getCsvFilename}
        >
          Download CSV File
        </CSVLink>}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DataTable);
