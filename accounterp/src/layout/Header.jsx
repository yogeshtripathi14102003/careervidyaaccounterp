import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../assets/icons/logo.jpeg'
import './header.css';
function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
       <img
  className="d-block" // w-100 hataya, sirf d-block rakha
  src={logo} 
  alt="Logo"
  style={{ height: '70px', width: 'auto' }} // Height fix kar di, width apne aap adjust hogi
/>
        
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/About">About </Nav.Link>
             <Nav.Link href="/Yogesh">Contact</Nav.Link>
              <Nav.Link href="/contact">university </Nav.Link>
               <Nav.Link href="/signup">signup</Nav.Link>
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Signup">Signup</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
              <Nav.Link href="/Login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;