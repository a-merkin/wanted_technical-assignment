import { LogoutClient } from '../logoutClient'

const logoutService = new LogoutClient();

logoutService.setSecurityData({ token: 'your-token' });

export default logoutService;