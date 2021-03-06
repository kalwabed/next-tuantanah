import { Container, Card, Row, Col } from 'react-bootstrap'
import { AiOutlineWhatsApp, AiOutlineFacebook, AiOutlineMail } from 'react-icons/ai'
import LazyLoad from 'react-lazyload'
import { Property } from '@/shared/interface'

const Contacts = ({ contact }: Pick<Property, 'contact'>) => {
  return (
    <div className="section my-2">
      <Container>
        <Card style={{ width: '100%', height: '120%' }}>
          <LazyLoad once height={100} offset={30}>
            <Card.Body>
              <Row className="mb-auto">
                {contact.length < 1 && <Col>Tidak ada kontak yang bisa dihubungi</Col>}
                {contact.map((contact, i) => (
                  <Col as="h5" xs={12} md={3} key={i}>
                    {contact.type === 1 ? (
                      <>
                        <AiOutlineWhatsApp size="1.2em" />
                        <a href={`https://wa.me/${contact.url}`} className="newlink ml-1">
                          {contact.name}
                        </a>
                      </>
                    ) : contact.type === 2 ? (
                      <>
                        <AiOutlineFacebook size="1.2em" />
                        <a href={`https://facebook.com/search/top?q=${contact.url}`} className="newlink ml-1">
                          {contact.name}
                        </a>
                      </>
                    ) : contact.type === 3 ? (
                      <>
                        <AiOutlineMail size="1.2em" />
                        <a href={`mailto:${contact.url}`} className="newlink ml-1">
                          {contact.name}
                        </a>
                      </>
                    ) : null}
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </LazyLoad>
        </Card>
      </Container>
    </div>
  )
}

export default Contacts
