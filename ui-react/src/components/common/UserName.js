import React from 'react';
import PropTypes from 'prop-types';
import BoldLink from './BoldLink';

const UserName = (props) => {
  const {userId, userName} = props;
  return (
    <BoldLink to={`/user/view/${userId}`}>
      {userName}
    </BoldLink>
  );
};


UserName.propTypes = {
  userId: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
};


export default (UserName);
