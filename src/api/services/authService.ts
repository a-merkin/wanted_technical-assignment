import { AuthClient } from '../authClient';

const authService = new AuthClient();

authService.setSecurityData({ token: 'your-token' });

export default authService;
