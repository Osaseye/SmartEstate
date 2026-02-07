export const MOCK_DATA_KEY = 'smartestate_db_v3'; // Bump version to reset data

const initialData = {
  users: [
    {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@smartestate.com',
      password: 'password',
      role: 'admin',
    },
    {
      id: 'u2',
      name: 'John Manager',
      email: 'manager@test.com',
      password: 'password',
      role: 'manager',
      estateId: null, // Will be assigned after onboarding
    },
    {
      id: 'u3',
      name: 'Jane Tenant',
      email: 'tenant@test.com',
      password: 'password',
      role: 'tenant',
      estateId: 'e2', // Linked to Banana Island
      houseId: 'h1',
      verificationStatus: 'verified', 
      proofOfIdentity: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=200&auto=format&fit=crop', // Mock ID
      employer: 'Tech Corp',
      nextOfKin: 'John Tenant (Father)'
    },
  ],
  estates: [
    {
       id: 'e1',
       name: 'Lekki Gardens Phase 3',
       address: 'Lekki-Epe Expressway, Lagos',
       type: 'gated',
       code: 'EST-1001',
       managerId: 'u2',
       image: '/images/estate(2).jpg'
    },
    {
       id: 'e2',
       name: 'Banana Island Estate',
       address: 'Ikoyi, Lagos',
       type: 'gated',
       code: 'EST-2020',
       managerId: 'u4',
       image: '/images/estate.png'
    },
    {
       id: 'e3',
       name: 'Victoria Garden City (VGC)',
       address: 'Lekki, Lagos',
       type: 'gated',
       code: 'EST-3005',
       managerId: 'u5',
       image: '/images/estate(2).jpg'
    },
    {
       id: 'e4',
       name: 'Richmond Gate Estate',
       address: 'Alma Beach Estate, Lekki',
       type: 'gated',
       code: 'EST-4100',
       managerId: 'u6',
       image: '/images/estate.png'
    },
    {
       id: 'e5',
       name: '1004 Housing Estate',
       address: 'Victoria Island, Lagos',
       type: 'complex',
       code: 'EST-5000',
       managerId: 'u7',
       image: '/images/estate(2).jpg'
    }
  ],
  houses: [],
  payments: [
    {
      id: 'p1',
      date: '2023-12-01',
      description: 'Rent Payment - Dec 2023',
      amount: 450000,
      status: 'approved',
      tenantId: 'u3',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'p2',
      date: '2024-01-01',
      description: 'Service Charge - Jan 2024',
      amount: 45000,
      status: 'pending',
      tenantId: 'u3',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop'
    }
  ],
  invoices: [
    {
       id: 'inv1',
       title: 'Annual Rent (2025)',
       amount: 2500000,
       dueDate: '2025-01-01',
       status: 'pending',
       tenantId: 'u3'
    },
    {
        id: 'inv2',
        title: 'Service Charge (Q1 2025)',
        amount: 50000,
        dueDate: '2025-02-15',
        status: 'pending',
        tenantId: 'u3'
    }
  ],
  maintenance: [
    {
      id: 'm1',
      title: 'Leaking Kitchen Sink',
      category: 'Plumbing',
      description: 'The pipe under the sink is leaking water onto the cabinet floor.',
      priority: 'high',
      status: 'pending',
      date: '2025-01-25',
      updates: [],
      tenantId: 'u3'
    },
    {
      id: 'm2',
      title: 'Broken AC in Master Bedroom',
      category: 'Electrical',
      description: 'The AC unit is making a loud noise and not cooling.',
      priority: 'medium',
      status: 'in-progress',
      date: '2025-01-20',
      updates: [
        { date: '2025-01-21', message: 'Technician scheduled for inspection.' }
      ],
      tenantId: 'u3'
    },
    {
      id: 'm3',
      title: 'Door Handle Loose',
      category: 'Carpentry',
      description: 'Front door handle is wobbly.',
      priority: 'low',
      status: 'resolved',
      date: '2024-12-15',
      updates: [
         { date: '2024-12-16', message: 'Fixed by maintenance team.' }
      ],
      tenantId: 'u3'
    }
  ],
  announcements: [
    {
      id: 'a1',
      title: 'Elevator Maintenance',
      type: 'news',
      content: 'Regular elevator maintenance will be carried out this Saturday from 10 AM to 2 PM.',
      date: '2025-02-01',
      priority: 'normal',
      author: 'Estate Manager'
    },
    {
      id: 'a2',
      title: 'Emergency: Water Shut Off',
      type: 'urgent',
      content: 'Due to a burst pipe in Block B, water will be shut off for 2 hours today.',
      date: '2025-02-01',
      priority: 'high',
      author: 'Facility Team'
    },
    {
      id: 'a3',
      title: 'Community BBQ',
      type: 'event',
      content: 'Join us for the annual community BBQ next Sunday!',
      date: '2025-02-10',
      priority: 'normal',
      author: 'Social Committee'
    }
  ],
  visitors: [
    { id: 'v1', name: 'John Doe', code: '8291', status: 'active', expiresAt: Date.now() + 86400000, type: 'Guest' },
    { id: 'v2', name: 'Delivery Driver', code: '1120', status: 'expired', expiresAt: Date.now() - 86400000, type: 'Delivery' }
  ],
  auth: null, // Current logged in user session
};

export const MockService = {
  init: () => {
    if (!localStorage.getItem(MOCK_DATA_KEY)) {
      localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(initialData));
    }
  },

  getAll: () => {
    return JSON.parse(localStorage.getItem(MOCK_DATA_KEY) || JSON.stringify(initialData));
  },

  login: (email, password) => {
    const data = MockService.getAll();
    const user = data.users.find(u => u.email === email && u.password === password);
    if (user) {
      data.auth = user;
      MockService.update(data);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  register: (userData) => {
    const data = MockService.getAll();
    if (data.users.find(u => u.email === userData.email)) {
      return { success: false, message: 'User already exists' };
    }

    let extraData = {};
    // If tenant registers with an existing estate code
    if (userData.role === 'tenant' && userData.estateCode) {
      const estate = data.estates.find(e => e.code === userData.estateCode);
      if (estate) {
        extraData = {
          estateId: estate.id,
          verificationStatus: 'pending'
        };
      }
    }

    const newUser = { ...userData, ...extraData, id: Date.now().toString() };
    data.users.push(newUser);
    // Auto-login
    data.auth = newUser; 
    MockService.update(data);
    return { success: true, user: newUser };
  },

  logout: () => {
    const data = MockService.getAll();
    data.auth = null;
    MockService.update(data);
  },

  // Estate Management
  getEstates: () => {
    const data = MockService.getAll();
    return data.estates;
  },

  createEstate: (estateData) => {
    const data = MockService.getAll();
    const newEstate = { ...estateData, id: Date.now().toString(), managerId: data.auth.id };
    data.estates.push(newEstate);
    // Link estate to manager
    const userIndex = data.users.findIndex(u => u.id === data.auth.id);
    if(userIndex > -1) {
        data.users[userIndex].estateId = newEstate.id;
        data.auth.estateId = newEstate.id; // Update session
    }
    MockService.update(data);
    return newEstate;
  },

  // House Management
  addHouse: (houseData) => {
    const data = MockService.getAll();
    const newHouse = { ...houseData, id: Date.now().toString() };
    data.houses.push(newHouse);
    MockService.update(data);
    return newHouse;
  },

  // Tenant Verification Flow
  requestAccess: (estateId) => {
    const data = MockService.getAll();
    const userIndex = data.users.findIndex(u => u.id === data.auth.id);
    if (userIndex > -1) {
      data.users[userIndex].verificationStatus = 'pending';
      data.users[userIndex].estateId = estateId;
      data.auth = data.users[userIndex]; // Update session
      MockService.update(data);
      return true;
    }
    return false;
  },
  
  update: (data) => {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data));
  }
};
