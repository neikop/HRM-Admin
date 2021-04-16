import React from "react";
import { CircularProgress, Checkbox } from "@material-ui/core";
import { Paper, Table, TableContainer, TableHead, TableBody, TablePagination } from "@material-ui/core";
import { TableRow, TableCell, TableSortLabel } from "@material-ui/core";
import { t } from "utils/common";

const EnhancedTable = ({ rowKey, dataSource = [], columns = [], loading, onChange, pagination, rowSelection }) => {
  const paginationActive = typeof pagination === "object" && pagination;
  const selectionActive = typeof rowSelection === "object" && rowSelection;

  const [page, setPage] = React.useState(paginationActive ? pagination.page : 1);
  const [size, setSize] = React.useState(paginationActive ? pagination.size : 5);
  const [order, setOrder] = React.useState("");
  const [orderBy, setOrderBy] = React.useState("");

  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  React.useEffect(() => {
    if (selectionActive) {
      const { selectedRowKeys } = rowSelection;
      if (Array.isArray(selectedRowKeys)) {
        setSelectedRowKeys(selectedRowKeys);
      }
    }
  }, [selectionActive, rowSelection]);

  const numSource = dataSource.length;
  const numSelect = selectedRowKeys.length;

  const dataSourceAll = React.useRef([]);
  React.useEffect(() => {
    dataSourceAll.current = dataSourceAll.current
      .concat(dataSource)
      .filter((item, index, array) => array.findIndex((next) => rowKey(next) === rowKey(item)) === index);
  }, [dataSource, rowKey]);

  const handleChangeSelectAll = (event) => {
    const { checked } = event.target;
    updateSelectedRowKeys(dataSource.map(rowKey), checked);
  };

  const handleChangeCheckbox = (item) => (event) => {
    const { checked } = event.target;
    updateSelectedRowKeys([rowKey(item)], checked);
  };

  const updateSelectedRowKeys = (chosenKeys, checked) => {
    const newSelectedRowKeys = checked
      ? selectedRowKeys.concat(chosenKeys).filter((item, index, array) => array.indexOf(item) === index)
      : selectedRowKeys.filter((item) => !chosenKeys.includes(item));

    setSelectedRowKeys(newSelectedRowKeys);

    const { onChange } = rowSelection;
    if (typeof onChange === "function") {
      const selectedRows = dataSourceAll.current.filter((item) => newSelectedRowKeys.includes(rowKey(item)));
      onChange(newSelectedRowKeys, selectedRows);
    }
  };

  const handleChangeOrder = (property) => (event) => {
    let newOrder, newOrderBy;
    if (property === orderBy) {
      if (order === "") {
        newOrder = "desc";
        newOrderBy = property;
      } else if (order === "desc") {
        newOrder = "asc";
        newOrderBy = property;
      } else if (order === "asc") {
        newOrder = "";
        newOrderBy = null;
      }
    } else {
      newOrder = "desc";
      newOrderBy = property;
    }
    setOrder(newOrder);
    setOrderBy(newOrderBy);

    handleChangeTable(page, size, newOrder, newOrderBy);
  };

  const handleChangePagination = (newPage, newSize) => {
    setPage(newPage);
    setSize(newSize);

    handleChangeTable(newPage, newSize, order, orderBy);
  };

  const handleChangeTable = (page, size, order, orderBy) => {
    if (typeof onChange === "function") {
      const sort = order && orderBy ? `${orderBy}_${order}` : undefined;
      onChange(page, size, sort);
    }
  };

  return (
    <Paper className="Table-Paper-container">
      <TableContainer>
        {loading && (
          <div className="Table-Loading-container">
            <CircularProgress size={24} />
          </div>
        )}
        <Table>
          <TableHead>
            <TableRow>
              {selectionActive && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelect > 0 && dataSource.some((item) => selectedRowKeys.includes(rowKey(item)))}
                    checked={numSelect > 0 && dataSource.every((item) => selectedRowKeys.includes(rowKey(item)))}
                    onChange={handleChangeSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((headCell) => (
                <TableCell key={headCell.key} align={headCell.align} width={headCell.width} padding="none">
                  {headCell.sorter ? (
                    <TableSortLabel
                      active={orderBy === headCell.key}
                      direction={orderBy === headCell.key ? order : "asc"}
                      onClick={handleChangeOrder(headCell.key)}>
                      {headCell.title}
                    </TableSortLabel>
                  ) : (
                    headCell.title
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource.map((item, index) => (
              <TableRow hover key={rowKey ? rowKey(item) : index}>
                {selectionActive && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRowKeys.indexOf(rowKey(item)) !== -1}
                      onChange={handleChangeCheckbox(item)}
                    />
                  </TableCell>
                )}
                {columns.map((rowCell) => (
                  <TableCell key={rowCell.key} align={rowCell.align} padding="none">
                    {rowCell.render ? rowCell.render(item, index) : item[rowCell.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {numSource === 0 && (
              <TableRow className="Table-Empty-container">
                <TableCell colSpan={columns.length + (selectionActive ? 1 : 0)}>
                  {loading ? t("Loading Data") : t("No Data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {paginationActive && <EnhancedPagnination pagination={pagination} onChange={handleChangePagination} />}
    </Paper>
  );
};

const EnhancedPagnination = ({ pagination = {}, onChange }) => {
  const { page = 1, size = 5, total = 0 } = pagination;

  const handleChangePage = (event, value) => {
    const newPage = value + 1;
    onChange(newPage, size);
  };

  const handleChangeRowsPerPage = (event) => {
    const { value: newSize } = event.target;
    onChange(1, newSize);
  };

  return (
    <TablePagination
      component="div"
      labelRowsPerPage={t("Rows per page")}
      backIconButtonText=""
      nextIconButtonText=""
      rowsPerPageOptions={[5, 10, 20, 50]}
      count={total}
      page={page - 1}
      rowsPerPage={size}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default EnhancedTable;
