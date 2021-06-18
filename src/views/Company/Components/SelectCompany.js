import React from "react";
import { Select } from "antd";
import { companyService } from "services/company";
import { t } from "utils/common";

let timeout;
let currentKeyword;

const fetch = (keyword, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentKeyword = keyword;

  const getListInfoCompany = () => {
    companyService
      .getListInfoCompany({
        params_request: { keyword: keyword },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { companies } = data;
          if (currentKeyword === keyword) callback(companies);
        }
      });
  };

  timeout = setTimeout(getListInfoCompany, 300);
};

const SelectCompany = ({ initCompany, initValue, onChange }) => {
  const [keyword, setKeyword] = React.useState();
  const [companyList, setCompanyList] = React.useState([]);

  const handleSearch = (keyword) => {
    if (keyword) {
      fetch(keyword, setCompanyList);
    } else {
      setCompanyList([]);
    }
  };

  const handleChange = (value) => {
    onChange(value);
    setKeyword(value);
  };

  React.useEffect(() => {
    if (initCompany) setCompanyList([initCompany]);
    companyService
      .getListInfoCompany({
        params_request: {},
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { companies } = data;
          setCompanyList((items) => items.concat(companies.filter((item) => item.id !== initCompany?.id)));
        }
      });
  }, [initCompany]);

  React.useEffect(() => {
    if (initValue) setKeyword(initValue);
  }, [initValue]);

  return (
    <Select
      showSearch
      value={keyword}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={t("Type to search...")}>
      {companyList.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectCompany;
