/* eslint-disable react/prop-types */
import { useState } from "react";
import PopUp from "../hive_elements/pop_up";
import HiveButton from "../hive_elements/hive_button";
import api from "../api/api";
import { useHive } from "../app_hooks";

function UserLoginPopUp() {
  const popUpId = "userLogin";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = api.users.useLogin();
  const hive = useHive();

  return (
    <PopUp id={popUpId} title="כניסה למערכת">
      <form>
        <label htmlFor="map_name"> שם המשתמש </label>
        <br />
        <input
          type="text"
          name="map_name"
          onInput={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="map_name"> סיסמה </label>
        <br />
        <input
          type="text"
          name="map_name"
          onInput={(e) => setPassword(e.target.value)}
        />
        <br />
        <HiveButton
          onClick={async () => {
            await loginUser({ user_name: name, password });
            hive.closePopUp(popUpId);
          }}
        >
          {" "}
          הכנס{" "}
        </HiveButton>
      </form>
    </PopUp>
  );
}

export default UserLoginPopUp;
