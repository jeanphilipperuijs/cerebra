import React, { useEffect, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, Collapse, TableSortLabel
} from '@mui/material';

type Order = 'asc' | 'desc';

type Props = {
  headers: string[];
  rows: any[];
  loading?: boolean;
  onRefresh?: () => void;
  refreshInterval?: number;
  rowRenderer?: (row: any) => React.ReactNode[];
  cellRenderer?: (value: any, key: string) => React.ReactNode;
  title?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

const ElasticsearchTable: React.FC<Props> = ({
  headers,
  rows,
  loading = false,
  onRefresh,
  refreshInterval,
  rowRenderer,
  cellRenderer,
  title = 'Elasticsearch Table',
  collapsible = false,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  useEffect(() => {
    if (open && refreshInterval && onRefresh) {
      const interval = setInterval(onRefresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, onRefresh]);

  const handleSort = (header: string) => {
    const isAsc = orderBy === header && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(header);
  };

  const getComparator = (order: Order, orderBy: string) => {
    return (a: any, b: any) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      const isNumber = (val: any) => !isNaN(parseFloat(val)) && isFinite(val);

      if (isNumber(aVal) && isNumber(bVal)) {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = aVal?.toString() ?? '';
      const bStr = bVal?.toString() ?? '';

      return order === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    };
  };

  const sortedRows = orderBy ? [...rows].sort(getComparator(order, orderBy)) : rows;

  const tableContent = (
    <Paper sx={{ p: 1, mt: 1, bgcolor: 'background.paper' }}>
      {/* <Typography
        variant="h6"
        sx={{ mb: 2, display: 'right', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {!open && title}

      </Typography> */}

      <Collapse in={open}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header} sortDirection={orderBy === header ? order : false}>
                    <TableSortLabel
                      active={orderBy === header}
                      direction={orderBy === header ? order : 'asc'}
                      onClick={() => handleSort(header)}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row, index) => (
                <TableRow key={index} hover>
                  {rowRenderer
                    ? rowRenderer(row).map((cell, idx) => (
                      <React.Fragment key={idx}>{cell}</React.Fragment>
                    ))
                    : headers.map((h) => (
                      <TableCell key={h}>
                        {cellRenderer ? cellRenderer(row[h], h) : String(row[h] ?? '-')}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );

  if (!collapsible) return tableContent;

  return (
    // <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
    //   <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
    //     <summary className="flex items-center justify-between cursor-pointer">
    //       <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
    //     </summary>
    //     <div className="overflow-x-auto mt-4">{tableContent}</div>
    //   </details>
    // </div>
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
      <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary className="flex items-center justify-between cursor-pointer">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={loading}
              variant="contained"
              size="small"
            >
              {loading ? 'Reloading...' : 'Reload'}
            </Button>
          )}
        </summary>
        <div>{tableContent}</div>
      </details>
    </div>
  );
};

export default ElasticsearchTable;
