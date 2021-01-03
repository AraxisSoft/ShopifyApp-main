import React , { useEffect, useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';

const allConstants = {
    abandon1: '{{shop_name}}: Hi {{first_name}}, we noticed there were a few items left in your shopping cart 🛒{{cart_items}} If you’re ready to complete your order, your cart awaits you at 👉 {{checkout_url}}',
    abandon2: '{{shop_name}}: Hi {{first_name}}, looks like you left some great items in your cart 🤗 {{cart_items}} Still on the edge with your purchase? Here’s a {{discount}}% OFF if you complete your purchase now. Offer automatically applied at checkout. Thank you 👋 Let’s go 👉 {{checkout_url}}',
    confirmation1:'',
    confirmation2:'',
    review1:'',
    review2:''
   
  };

function MessageTemplate(props) {
    const [open, setOpen] = useState(false); // for Dialogue box
    const [section, setSection] = useState(null); // Abandon | Review | Order Confirmation

    const [variable, setVariable] = useState(''); // For checkbox
    const [textBefore, setTextBefore]= useState('');
    const [textAfter, setTextAfter]= useState('');
    const [msgContent, setMsgContent]= useState(''); //

    //For Abandon | Review | Order Confirmation
    const [msg1,setMsg1]=useState('');
    const [msg2,setMsg2]=useState('');

    

    const insertMyText = e => {

        let textToInsert = variable
        let cursorPosition = e.target.selectionStart
        let textBeforeCursorPosition = e.target.value.substring(0, cursorPosition)
        let textAfterCursorPosition = e.target.value.substring(cursorPosition, e.target.value.length)
        e.target.value = textBeforeCursorPosition + textToInsert + textAfterCursorPosition
    
        setTextBefore(textBeforeCursorPosition)
        setTextAfter(textAfterCursorPosition)
        setMsgContent(textBeforeCursorPosition + variable + textAfterCursorPosition)
        setVariable('');
    
      }

      const handleChange = (event) => {
        setVariable(event.target.value);
        console.log(event.target.value);
        setVariable('name');
        setMsgContent(textBefore+ ' ' +event.target.value+ ' ' + textAfter);
        setVariable('');
        
      };

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const updateMsgTemplate = (msgNum) =>{
        console.log("OPEN");
        setOpen(true);

      }
    
    return (
        <div>
            <div>
                <button onClick={(e)=>{
                    e.preventDefault();
                    console.log("OPEN");
                    updateMsgTemplate( "msg1");}
                    }>Edit Msg1</button>

                <button>Edit Msg1</button>
            </div>
             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
             <DialogTitle id="form-dialog-title">Edit Message</DialogTitle>
             <DialogContent>
             <TextField autoFocus margin="dense" id="name" label="Message" fullWidth />
                    <div >
                        <p >Content</p>
                        <InputLabel id="demo-simple-select-outlined-label">Variable</InputLabel>
                        <Select variant="outlined"
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={variable}

                            onChange={handleChange}
                            label="Variable"
                        >
                            <MenuItem value=""> Variable </MenuItem>
                            <MenuItem value="{{first_name}}">First Name</MenuItem>
                            <MenuItem value="{{shop_name}}">Shop Name</MenuItem>
                            <MenuItem value="{{cart_items}}">Cart Items</MenuItem>
                            <MenuItem value="{{checkout_url}}">Checkout url</MenuItem>
                            <MenuItem value="{{order_value}}">Total Amount</MenuItem>
                        </Select>

                    </div>
                    <TextField
                        variant="outlined"
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Message"
                        multiline
                        rows={5}
                        onChange={insertMyText}
                        value={msgContent}
                        fullWidth
                    />
                    <div>
                        <Checkbox
                            value="checkedA"
                            label="Create discount code (creates a unique code for each customer)"
                            inputProps={{ 'aria-label': 'Checkbox A' }}
                        />

                        Create discount code (creates a unique code for each customer)
                    </div>
                       <TextField
                        id="filled-number"
                        label="Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        fullWidth
                        />
             </DialogContent>
             
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
     
        </div>
    );
}

export default MessageTemplate;