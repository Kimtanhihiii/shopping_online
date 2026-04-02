import { useNavigate, useParams } from 'react-router-dom';

function withRouter(Component) {
  return (props) => (
    <Component
      {...props}
      navigate={useNavigate()}
      params={useParams()}
    />
  );
}

export default withRouter;
