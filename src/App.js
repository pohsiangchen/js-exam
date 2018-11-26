import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import TestPage from './components/TestPage/';
import MainPage from './components/MainPage/';
import LoginPage from './components/LoginPage';
import AdminQuestionDispatchPage from './components/AdminQuestionDispatchPage';
import SubjectPage from './components/SubjectPage';

//amplify
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure(aws_exports);
Auth.signIn("Admin", "Admin@123456")
    .then(user => {
      const session = Amplify.Auth.currentSession()
  .then(s => {
    console.log(s.getAccessToken().getJwtToken());
  }).catch(e=>console.log(e));
    })
    .catch(err => console.log(err));
const App = () => (
  <Router>
    <div>
      <Route exact path="/js-exam/subject" component={SubjectPage} />
      <Route exact path="/js-exam/admin/dispatch" component={AdminQuestionDispatchPage} />
      <Route exact path="/js-exam/test" component={TestPage} />
      <Route exact path="/js-exam/" component={MainPage} />
      <Route path="/js-exam/login" component={LoginPage} />
      {/* <Route exact path="/" component={() => <Redirect to="/js-exam"/>}/> */}
      {/* <Route exact path="/" component={() => <Redirect to="/js-exam/test"/>}/> */}
      <Route exact path="/" component={() => <Redirect to="/js-exam/admin/dispatch"/>}/>
    </div>
  </Router>
);

export default App;
// export default withAuthenticator(App, true);