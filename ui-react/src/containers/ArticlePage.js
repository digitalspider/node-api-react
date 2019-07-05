import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Section from '../components/common/Section';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  section: {
    padding: '15px 0',
  },
});

// @inject('article')
// @observer
class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      articleId: null,
      viewMode: null,
      fetchComplete: false,
    };
  }

  async componentDidMount() {
    const {articles} = this.props;
    const articleId = this.props.match.params.id;
    let article = null;
    try {
      console.log(`articleId=${articleId}`)
      if (articleId) {
        article = await articles.getArticle(articleId);
      } else {
        article = await articles.newArticle();
      }
      console.log(`article=${JSON.stringify(article)}`)
      this.setState({articleId: articleId});
      this.setState({article: article});
    } finally {
      this.setState({fetchComplete: true});
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <Section className={classes.section}>
        {!this.state.fetchComplete ?
          ( <CircularProgress /> ) :
          ( <div id="page">
            <Typography variant="h4" gutterBottom>
            Article Page
            </Typography>
          </div>
          )
        }
      </Section>
    );
  }
}

export default inject('articles', 'users', 'notifier')(observer(withStyles(styles)(ArticlePage)));
