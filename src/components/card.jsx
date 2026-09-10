import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { HiDocumentAdd } from "react-icons/hi";
import { motion } from "framer-motion";
function Cards({ reference, color, quantity = 1 }) {
    let items = [];
    for (let i = 1; i <= quantity; i++) {
        items.push(
            <motion.div drag dragConstraints={reference}
                dragElastic={0.1}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }} key={i} className="cards relative w-60 h-90 bg-white rounded-2xl text-black text-l float-left overflow-hidden">
                <HiDocumentAdd style={{ height: '30px', width: '30px' }} />
                
                <FloatingLabel controlId="floatingTextarea2" placeholder="write something...">
                    <Form.Control
                        as="textarea"
                        className="card-textarea"
                        style={{ height: '245px', border: 'none', resize: 'none' }}/>
                </FloatingLabel>


                <footer className="absolute bottom-0  w-full h-15 left-0" style={{ backgroundColor: color || '#F26522' }}>

                </footer>

            </motion.div >
        );
    }

    return (
        <>
            {items}
        </>
    );
}

export default Cards;
