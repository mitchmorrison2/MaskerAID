const { UserProfile } = require("./pages/UserProfile");
const { OrderHistory } = require("./pages/OrderHistory");
const {Login} = require("./pages/Login");

const routes = (
    <Route path="/" component={Login}>
      <Route path="UserProfile" component={UserProfile} />
      <Route path="OrderHistory" component={OrderHistory}>
      </Route>
      <Route path="*" component={NoMatch} />
    </Route>
  )