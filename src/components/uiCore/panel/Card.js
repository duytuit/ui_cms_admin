import { Card as Cards } from 'primereact/card';
import PropTypes from 'prop-types'; 
import React from 'react'

const Card = ({...rest}) => {

    return (
        <Cards {...rest} />
    )

};

// Card.propTypes = {
//     arrayProp: PropTypes.array,
//     stringProp: PropTypes.string,
//     numberProp: PropTypes.number,
//     boolProp: PropTypes.bool,
// }
 
// // Creating default props
// Card.defaultProps = {
//     arrayProp: ['Ram', 'Shyam', 'Raghav'],
//     stringProp: "GeeksforGeeks",
//     numberProp: "10",
//     boolProp: true,
// }
 

export default Card;