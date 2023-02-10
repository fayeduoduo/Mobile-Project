import bcrapt from 'bcryptjs';

const users = [
    {
        name: 'Admin',
        email: 'admin@example.com',
        password: bcrapt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Summer',
        email: 'summer@example.com',
        password: bcrapt.hashSync('123456', 10),
    },
    {
        name: 'Henry',
        email: 'henry@example.com',
        password: bcrapt.hashSync('123456', 10),
    }
]
export default users;