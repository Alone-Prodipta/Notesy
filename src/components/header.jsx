import { Link } from "react-router-dom";
import Foreground from "./Foreground/foreground.jsx";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import AuthButtons from "./authButtons.jsx";
function Header() {
    return (
        <>
            <Container className="glass-container border-none shadow-none">
                <Navbar expand="lg" className="border-none shadow-none w-100">
                    <Container>
                        <Navbar.Brand href="component/homepage" className="text-black">Notesy</Navbar.Brand>
                    </Container>
                    <Col xs="auto" className="d-flex align-items-center gap-2">
                        <Button className="bg-custom">
                            <Link className="text-white" to="/Foreground">Get Started</Link>
                        </Button>
                        <AuthButtons />
                    </Col>
                </Navbar>
            </Container>
        </>
    );
}
export default Header;

