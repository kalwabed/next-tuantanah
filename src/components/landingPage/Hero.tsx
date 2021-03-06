import { FcKey, FcManager, FcGlobe } from 'react-icons/fc'
import { Row, Col, Button, Spinner } from 'react-bootstrap'

import LazyLoad from 'react-lazyload'
import content from './content'

const Hero = ({ refVisitorDealer }: { refVisitorDealer: any | null }) => {
  const showVisLer = () => {
    window.scrollTo({
      top: refVisitorDealer.current.offsetTop + 30,
      behavior: 'smooth'
    })
  }

  return (
    <div className="my-3">
      <Row>
        <Col>
          <p className="h2 font-weight-bold">
            Wujudkan Properti Impian Anda Bersama <span className="text-success logo-font">tuantanah</span>
          </p>
          <p className="font-weight-light mb-4 text-wrap" dangerouslySetInnerHTML={{ __html: content.hero }} />
          <div className="mb-4" style={{ marginTop: 30 }}>
            <Button className="shadow-lg pr-4" size="lg" variant="success" onClick={showVisLer}>
              Show Me
            </Button>
          </div>
          <Row className="mt-4">
            <Col>
              <FcManager className="h3 mr-2" />
              <h6 className="mt-3">
                79+ <span className="text-muted font-weight-light">dealers</span>
              </h6>
            </Col>
            <Col>
              <FcKey className="h3 mr-2" />
              <h6 className="mt-3">
                163+ <span className="text-muted font-weight-light">lands</span>
              </h6>
            </Col>
            <Col>
              <FcGlobe className="h3 mr-2" />
              <h6 className="mt-3">
                58+ <span className="text-muted font-weight-light">regions</span>
              </h6>
            </Col>
          </Row>
        </Col>
        <Col className="d-none d-md-block">
          <LazyLoad once height={200} placeholder={<Spinner animation="grow" />}>
            <img src={content.assets.hero} width="580" height="350" alt="image" />
          </LazyLoad>
        </Col>
      </Row>
    </div>
  )
}

export default Hero
