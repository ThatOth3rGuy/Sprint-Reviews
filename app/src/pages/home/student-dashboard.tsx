import type { NextPage } from "next";
import { useState, useCallback } from "react";
//TODO: import RegisterToCoursePopUp from "../components/register-to-course-pop-up";
//TODO:  import PortalPopup from "../components/portal-popup";
//TODO: import ProfileOptions from "../components/profile-options";
import styles from "../../styles/index.module.css";

interface State {
  isRegisterToCoursePopUpOpen: boolean;
  isProfileOptionsOpen: boolean;
}

const initialState: State = {
  isRegisterToCoursePopUpOpen: false,
  isProfileOptionsOpen: false,
};

const PageHeader: NextPage = () => {
  const [state, setState] = useState(initialState);

  const togglePopup = useCallback((popupName: keyof State) => {
    setState((prevState) => ({
      ...prevState,
      [popupName]: !prevState[popupName],
    }));
  }, []);

  const openRegisterToCoursePopUp = () => togglePopup("isRegisterToCoursePopUpOpen");
  const closeRegisterToCoursePopUp = () => togglePopup("isRegisterToCoursePopUpOpen");
  const openProfileOptions = () => togglePopup("isProfileOptionsOpen");
  const closeProfileOptions = () => togglePopup("isProfileOptionsOpen");

  const onAssignmentsContainerClick = () => {};
  const onGradesContainerClick = () => {};
  const onSettingsContainerClick = () => {};
  const onNotificationsContainerClick = () => {};
  const onLogoutContainerClick = () => {};

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderChild} />
        <i className={styles.dashboard}> Dashboard</i>
        <div className={styles.addCourse} onClick={openRegisterToCoursePopUp}>
          <div className={styles.addCourseChild} />
          <img className={styles.plusMathIcon} alt="" src="Plus Math.png" />
        </div>
        <div className={styles.profile} onClick={openProfileOptions}>
          <div className={styles.addCourseChild} />
          <img className={styles.accountIcon} alt="" src="Account.png" />
        </div>
      </div>
      {state.isRegisterToCoursePopUpOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeRegisterToCoursePopUp}
        >
          <RegisterToCoursePopUp onClose={closeRegisterToCoursePopUp} />
        </PortalPopup>
      )}
      {state.isProfileOptionsOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeProfileOptions}
        >
          <ProfileOptions onClose={closeProfileOptions} />
        </PortalPopup>
      )}
      <div className={styles.navbar}>
        <div className={styles.navbarChild} />
        <img className={styles.sprintrunner2Icon} alt="" src="sprintrunner 2.png" />
        <div className={styles.assignments} onClick={onAssignmentsContainerClick}>
          <div className={styles.assignmentsChild} />
          <b className={styles.assignments1}>Assignments</b>
          <img className={styles.homeworkIcon} alt="" src="Homework.png" />
        </div>
        <div className={styles.grades} onClick={onGradesContainerClick}>
          <div className={styles.assignmentsChild} />
          <b className={styles.grades1}>Grades</b>
          <img className={styles.reportCardIcon} alt="" src="Report Card.png" />
        </div>
        <div className={styles.home}>
          <div className={styles.homeChild} />
          <b className={styles.home1}>Home</b>
          <img className={styles.homeIcon} alt="" src="Home.png" />
        </div>
        <div className={styles.settings} onClick={onSettingsContainerClick}>
          <div className={styles.assignmentsChild} />
          <b className={styles.settings1}>Settings</b>
          <img className={styles.settingsIcon} alt="" src="Settings.png" />
        </div>
        <div className={styles.notifications} onClick={onNotificationsContainerClick}>
          <div className={styles.assignmentsChild} />
          <b className={styles.notifications1}>Notifications</b>
          <img className={styles.notificationIcon} alt="" src="Notification.png" />
        </div>
        <div className={styles.logout} onClick={onLogoutContainerClick}>
          <div className={styles.assignmentsChild} />
          <img className={styles.exportIcon} alt="" src="Export.png" />
        </div>
      </div>
    </>
  );
};

export default PageHeader;
