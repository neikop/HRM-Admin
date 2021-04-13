import { Tab, Tabs } from "@material-ui/core";
import React from "react";

const Menu = () => {
  const [activeTab, setActiveTab] = React.useState("/");
  return (
    <>
      <Tabs
        scrollButtons="auto"
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        aria-label="simple tabs example">
        <Tab label="Item One" value="/" />
        <Tab label="Item Two" value="/two" />
        <Tab label="Item Three" value="/three" />
      </Tabs>
    </>
  );
};

export default Menu;
