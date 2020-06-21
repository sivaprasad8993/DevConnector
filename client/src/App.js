import React, { Fragment, useEffect } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Notfound from './components/extra/Notfound';
import store from './store';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import { getCurrentProfile } from './actions/profile';
import PrivateRoute from './components/routing/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(getCurrentProfile());
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route path='/' exact component={Landing} />
          <div className='container'>
            <Alert />
            <Switch>
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/profiles/:id' component={Profile} />
              <Route path='/profiles' component={Profiles} />
              <PrivateRoute path='/dashboard' exact component={Dashboard} />
              <PrivateRoute path='/create-profile' exact component={CreateProfile} />
              <PrivateRoute path='/edit-profile' exact component={EditProfile} />
              <PrivateRoute path='/add-experience' exact component={AddExperience} />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute exact path="/posts/:id" component={Post} />
              <PrivateRoute path='/add-education' exact component={AddEducation} />
              <Route path='/not-found' exact component={Notfound} />
              {/* <Redirect to ='/not-found' />  */}
            </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
