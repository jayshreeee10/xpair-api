import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Box
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { getXpairIOList } from '../../services/api';

const XpairOverview = () => {
  const [ioList, setIoList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getXpairIOList().then(setIoList);
  }, []);

  const handleActionClick = (action, ioId) => {
    navigate(`/xpairs/${ioId}?mode=${action}`);
  };

  return (
    <Box>
      <h2>Xpair IO Overview</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Xpair IO ID</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Name</TableCell>
              {/* <TableCell>Type</TableCell> */}
              <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ioList.map((io) => (
              <TableRow key={io.xpair_io_id}>
                <TableCell>{io.xpair_io_id}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{io.xpair_io_name}</TableCell>
                {/* <TableCell>{io.xpair_io_type}</TableCell> */}
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleActionClick('add', io.xpair_io_id)}
                    sx={{ mr: 1 }}
                  >
                    Add Xpair Attribute
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="warning"
                    onClick={() => handleActionClick('edit', io.xpair_io_id)}
                    sx={{ mr: 1 }}
                  >
                    Edit Xpair IO
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleActionClick('delete', io.xpair_io_id)}
                  >
                    Delete Xpair IO
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default XpairOverview;
