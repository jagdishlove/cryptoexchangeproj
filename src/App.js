import './App.css';
import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { io } from 'socket.io-client';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core';
import Loading from './components/Loading';

const useStyles = makeStyles({
  heading: {
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 900,

  },
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 890,
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "lightblue",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: "#f0f8ff",
    },
  },
}))(TableRow);





function App() {
  const [data, setData] = useState([]);
  const [response, setResponse] = useState([])
  const classes = useStyles();
  const URL = "https://api.delta.exchange/v2/products"


  const payload = {

    "type": "subscribe",
    "payload": {
      "channels": [
        {
          name: "v2/ticker",
          symbols: ["BTCUSD", "BTCUSDT"]
        },
      ]
    }

  }



  useEffect(() => {
    const client = new W3CWebSocket('wss://production-esocket.delta.exchange');
    client.onopen = () => {
      //subscribe to the channel
      client.send(JSON.stringify(payload));
    };

    client.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setResponse(response);

    };
  }, [])




  const getData = async () => {
    const users = await axios.get(URL);
    setData(users.data.result);
  };


  useEffect(() => {
    getData();
  }, [])

  console.log(response)




  return (
    <div className="App">
      {data.length === 0 ? <Loading /> :

        <Paper>
          <TableContainer className={classes.container} component={Paper}>
            <Table sx={{ minWidth: 650, position: 'fixed' }} aria-label="simple table">
              <TableHead className={classes.heading}>
                <TableRow >
                  <StyledTableCell style={{ position: 'sticky', left: 0, zIndex: 900 }}><Typography variant='h4' style={{ fontWeight: '600' }}>Symbol</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant='h4' style={{ fontWeight: '600' }}>Description</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant='h4' style={{ fontWeight: '600' }}>Underlying Asset</Typography></StyledTableCell>
                  <StyledTableCell align="center"><Typography variant='h4' style={{ fontWeight: '600' }}>mark Price</Typography></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <StyledTableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell style={{ position: 'sticky', background: 'white', left: 0, zIndex: 800 }} component="th" scope="row"><Typography> {row.symbol}</Typography></TableCell>
                    <TableCell align="center"><Typography>{row.description}</Typography></TableCell>
                    <TableCell align="center"><Typography>{row.underlying_asset.symbol}</Typography></TableCell>
                    <TableCell align="center"><Typography>{response.channels ? "Loading..." : response?.mark_price}</Typography></TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <h1>{response?.mark_price}</h1>
        </Paper>

      }
    </div>
  );
}

export default App;
