import React from 'react';
import BoldLink from './common/BoldLink';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DataStatus from './DataStatus';
import {withStyles} from '@material-ui/core/styles';
import {formatDate} from '../utils/helper.js';
import UserName from './common/UserName';
import common from '../common.js';

const styles = (theme) => ({
  trafficLight: {
    borderLeftWidth: 5,
    borderLeftStyle: 'solid',
    width: '350px',
  },
});

const DataRow = ({data, classes, isEditable}) => (
  <TableRow hover={true}>
    <TableCell
      className={classes.trafficLight}
      style={{borderLeftColor: data.trafficLightColor}}
    >
      <BoldLink to={`/article/${data.id}`}>
        {data.name}
      </BoldLink>
    </TableCell>
    <TableCell>{data.organisation}</TableCell>
    <TableCell>
      <DataStatus name={data.status}/>
    </TableCell>
    <TableCell>
      <UserName
        userId={data.requesterId}
        userName={data.requester}
      />
    </TableCell>
    <TableCell>
      {formatDate(data.createdDate, common.date.formats.displayDateTime)}
    </TableCell>
  </TableRow>
);

export default withStyles(styles)(DataRow);
