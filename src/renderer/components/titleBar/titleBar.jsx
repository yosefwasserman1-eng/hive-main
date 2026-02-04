/* eslint-disable react/jsx-no-bind */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import api from "../../api/api";
import PopUp from "../../hive_elements/pop_up";
import HiveButton from "../../hive_elements/hive_button";
import { useSettingsData } from "../../api/useHiveFetch";
import "./titleBar.css";
import RollingList from "../../hive_elements/rolling_list";
import AddProjectPop from "../add_project_pop";
import { useHive } from "../../app_hooks";
import ImportProjectPopUp from "../importProject";
import DropDown from "../dropDown/dropDown";
import UserCreatePopUp from "../userCreatePopUp";
import UserLoginPopUp from "../userLoginPopUp";

function ProjectsDrop({ open }) {
  const projectsData = api.projects.useData();
  const navigate = useNavigate();
  const hive = useHive();

  function renderProjects() {
    if (!open) return;
    if (projectsData.isLoading) return "טוען";
    const projectsList = projectsData.data.map((project) => {
      return { name: project.name, value: project.name };
    });
    projectsList.push({
      name: "הוסף פרוייקט",
      value: "add project",
      onClick: () => hive.openPopUp("add_project"),
    });
    projectsList.push({
      name: "ייבא פרוייקט",
      value: "import project",
      onClick: () => hive.openPopUp("ImportProjectPopUp"),
    });
    return (
      <RollingList
        items={projectsList}
        onItemClick={(item) => navigate(`/maps/${item.value}`)}
      />
    );
  }
  return <DropDown open={open}>{renderProjects()}</DropDown>;
}
function SettingsDrop({ open }) {
  const hive = useHive();

  const settingsList = [
    {
      name: "open server settings",
      value: "open server settings",
      onClick: () => hive.openPopUp("server_settings"),
    },
  ];
  if (!open) return;
  return (
    <DropDown open={open}>
      <RollingList items={settingsList} />
    </DropDown>
  );
}
function ServerSettingsPopUp() {
  const queryClient = useQueryClient();
  const settings = useSettingsData();
  const [serverPort, setServerPort] = useState(settings.data.serverPort);
  const [serverHost, setServerHost] = useState(settings.data.serverHost);

  useEffect(() => {
    setServerPort(settings.data.serverPort);
    setServerHost(settings.data.serverHost);
  }, [settings.data]);

  async function onConnect() {
    const newSettings = { ...settings.data };
    newSettings.serverHost = serverHost;
    newSettings.serverPort = serverPort;
    queryClient.setQueriesData("settings", newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
    // await window.electron.store.set('settings', newSettings);
    // queryClient.invalidateQueries(['settings']);
  }

  return (
    <PopUp id="server_settings" title="server settings">
      <form style={{ margin: "15px" }}>
        <label> server host </label>
        <br />
        <input
          type="text"
          value={serverHost}
          style={{
            color: `${
              serverHost === settings.data.serverHost ? "gray" : "black"
            }`,
          }}
          onChange={(e) => {
            setServerHost(e.target.value);
          }}
        />
        <br />
        <label> server port </label>
        <br />
        <input
          type="text"
          value={serverPort}
          style={{
            color: `${
              serverPort === settings.data.serverPort ? "gray" : "black"
            }`,
          }}
          onChange={(e) => {
            setServerPort(e.target.value);
          }}
        />
        <br />
        <HiveButton onClick={onConnect}> connect </HiveButton>
      </form>
    </PopUp>
  );
}

function TitleBar() {
  const [projects, setProjects] = useState(false);
  const [settings, setSettings] = useState(false);
  const { map_name, project_name } = useParams();
  const hive = useHive();
  const user = api.users.useData();

  return (
    <div className="title-bar">
      {/* <WindowControls /> */}
      <div className="app-icon" />
      <div className="options" draggable="false">
        <div className="option">
          <Link to={"/"} className="option-title">
            {"בית"}
          </Link>
        </div>
        <div className="option">
          <div
            className="option-title"
            onClick={() => hive.openPopUp("userLogin")}
          >
            {" "}
            {`${user.data ? user.data : "user"}`}
          </div>
          <UserCreatePopUp />
          <UserLoginPopUp />
        </div>
        <div className="option">
          <Link to={"/admin"} className="option-title">
            {"ניהול"}
          </Link>
        </div>
        <div className="option">
          <div className="option-title"> חלון </div>
        </div>
        <div
          className="option"
          onMouseOver={() => setSettings(true)}
          onMouseOut={() => setSettings(false)}
        >
          <div className="option-title"> הגדרות </div>
          <SettingsDrop open={settings} />
        </div>
        <ServerSettingsPopUp />
        <div
          className="option"
          onMouseOver={() => setProjects(true)}
          onMouseOut={() => setProjects(false)}
        >
          <div className="option-title">פרוייקטים</div>
          <ProjectsDrop open={projects} />
        </div>
        <AddProjectPop id="add_project" />
        <ImportProjectPopUp />
      </div>
      <div className="title-line" dir="rtl">
        {`${project_name ? `פרוייקט : ${project_name} ` : ""}`}
        {`${map_name ? `| מפה : ${map_name} ` : ""}`}
      </div>
    </div>
  );
}

export default TitleBar;
