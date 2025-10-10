import { Accordion as Accordions } from 'primereact/accordion';

// const AccordionTab = ({...prop}) => {

//     return (
//         <AccordionTabs {...prop} />
//     )

// };

const Accordion = ({...rest}) => {

    return (
        <Accordions {...rest} />
    )

};

export {
    Accordion, 
};