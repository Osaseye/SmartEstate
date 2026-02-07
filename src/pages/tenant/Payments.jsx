import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { FaMoneyBillWave, FaHistory, FaCheckCircle, FaClock } from 'react-icons/fa';

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const idToQuery = user.uid || user.id;

          // Fetch Payments
          const payQuery = query(collection(db, "payments"), where("tenantId", "==", idToQuery));
          const paySnap = await getDocs(payQuery);
          const userPayments = paySnap.docs.map(d => ({id: d.id, ...d.data()}));
          setPayments(userPayments.sort((a, b) => b.createdAt - a.createdAt));

          // Fetch Invoices (pending)
          const invQuery = query(collection(db, "invoices"), where("tenantId", "==", idToQuery), where("status", "==", "pending"));
          const invSnap = await getDocs(invQuery);
          const userInvoices = invSnap.docs.map(d => ({id: d.id, ...d.data()}));
          setInvoices(userInvoices);

        } catch (err) {
            console.error("Error fetching payment data:", err);
        }
      }
    };
    fetchData();
  }, [user]);

  const totalOutstanding = invoices.reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payments & Invoices</h1>
        <p className="text-gray-500">Manage your payments and view transaction history.</p>
      </div>

      {/* Hero Section - Outstanding Balance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Outstanding Balance</h2>
          <div className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(totalOutstanding)}</div>
          <p className="text-sm text-gray-500 mt-1">
            {invoices.length} pending invoice{invoices.length !== 1 && 's'}
          </p>
        </div>
        <Link 
          to="/tenant/payments/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FaMoneyBillWave />
          Make Payment
        </Link>
      </div>

      {/* Pending Invoices List */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Pending Invoices</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">{invoice.title}</h4>
                  <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                </div>
                <div className="font-semibold text-gray-700">
                  {formatCurrency(invoice.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaHistory className="text-gray-400"/> Transaction History
            </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No payment history found.
                    </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr 
                    key={payment.id} 
                    onClick={() => navigate(`/tenant/payments/${payment.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-gray-900 group-hover:text-blue-600 transition-colors">{payment.date}</td>
                    <td className="px-6 py-4 text-gray-700">{payment.description}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">
                      {payment.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <FaCheckCircle className="text-xs" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                          <FaClock className="text-xs" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
