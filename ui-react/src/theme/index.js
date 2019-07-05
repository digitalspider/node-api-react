import {createMuiTheme} from '@material-ui/core/styles';
import themeCommon from './themeCommon';
import themeDefault from './themeDefault';
import _ from 'lodash';

const getTheme = (customTheme) => {
  const newTheme = customTheme ? customTheme : themeDefault;
  return createMuiTheme(_.merge({}, {
    typography: {
      useNextVariants: true,
    },
  }, themeCommon, newTheme));
};

export default getTheme;
