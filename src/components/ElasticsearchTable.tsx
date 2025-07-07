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
  title = 'Elasticsearch Table',
  collapsible = false,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  useEffect(() => {
    if (refreshInterval && onRefresh) {
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
      const aVal = a[orderBy] ?? '';
      const bVal = b[orderBy] ?? '';
      return order === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    };
  };

  const sortedRows = orderBy ? [...rows].sort(getComparator(order, orderBy)) : rows;

  // Render the table content (without collapsible wrapper)
  const tableContent = (
    <Paper sx={{ p: 2, mt: 4, bgcolor: 'background.paper' }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {title}
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
      </Typography>

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
                  {(rowRenderer
                    ? rowRenderer(row)
                    : headers.map(h => (
                      <TableCell key={h}>{String(row[h] ?? '-')}</TableCell>
                    )))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );

  if (!collapsible) {
    return tableContent;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
      <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary className="flex items-center justify-between cursor-pointer">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          {/*onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="ml-4 px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Reloading...' : 'Reload'}
            </button>
          )*/}
        </summary>
        <div className="overflow-x-auto mt-4">
          {tableContent}
        </div>
      </details>
    </div>
  );
};

export default ElasticsearchTable;
