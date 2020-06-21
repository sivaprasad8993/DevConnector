import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { setAuthToken } from '../../utils/setAuthToken';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Education from './Education';
import Experience from './Experience';

const Dashboard = ({ getCurrentProfile, profile: { profile, loading }, auth: { user }, deleteAccount }) => {
    useEffect(() => {
        setAuthToken(localStorage.token);
        getCurrentProfile();
    }, [getCurrentProfile]);
    return (
        loading && profile === null ?
            (<Spinner />) :
            <Fragment>
                <h1 className='large text-primary'>Dashboard</h1>
                <p className='lead'>
                    <i className='fa fa-user' /> Welcome {user && user.name} </p>
                {profile !== null ? <Fragment>
                    <DashboardActions />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />
                </Fragment> : <Fragment>
                        <p>You have not yet setup a profile, please add some info</p>
                        <Link to='/create-profile' className='btn btn-primary my-1'>
                            Create profile
                </Link>
                    </Fragment>}

                <button className="btn btn-danger" onClick={() => deleteAccount()}><i className='fa fa-user-minus' /> Delete Account</button>
            </Fragment>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
