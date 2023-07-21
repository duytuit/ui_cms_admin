import React from 'react'
import { Message as Messages } from 'primereact/message';
import PropsType from 'prop-types'
// import { MessageType } from '../PrimereactType';

const Message = (props) => {

    return ( 
        <Messages {...{ ...props }} />
    )
};

// Message.propTypes={
//     newp:PropsType.string,
//     ...MessageType
// }

export default Message;