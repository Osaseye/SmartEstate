export const MOCK_DATA_KEY = 'smartestate_db_v2'; // Bump version to reset data

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
      estateId: null,
      houseId: null,
      verificationStatus: 'pending', // pending, verified, rejected
    }
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
