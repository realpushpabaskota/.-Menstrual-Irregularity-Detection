import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h2>
          <p className="text-gray-600 mb-6">Please complete the prediction form first.</p>
          <button
            onClick={() => navigate('/predict')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:from-pink-600 hover:to-rose-700 transition duration-200"
          >
            Go to Prediction Form
          </button>
        </div>
      </div>
    );
  }

  const { prediction, probability, irregularity_types } = result;

  const isIrregular = prediction === 1;
  const probabilityPercent = (probability * 100).toFixed(1);

  const getRiskLevel = (prob) => {
    if (prob < 0.3) return { level: 'Low', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    if (prob < 0.7) return { level: 'Medium', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    return { level: 'High', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
  };

  const riskInfo = getRiskLevel(probability);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`py-8 px-8 ${isIrregular ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white bg-opacity-20 backdrop-blur-sm mb-4">
                {isIrregular ? (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isIrregular ? 'Irregular Cycle Detected' : 'Regular Cycle'}
              </h1>
              <p className="text-white text-opacity-90">
                {isIrregular
                  ? 'Your analysis indicates potential menstrual cycle irregularities'
                  : 'Your analysis indicates a regular menstrual cycle pattern'}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Prediction Confidence</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{probabilityPercent}%</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        isIrregular
                          ? 'bg-gradient-to-r from-red-500 to-rose-600'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600'
                      }`}
                      style={{ width: `${probabilityPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Risk Level</h3>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${riskInfo.bgColor} ${riskInfo.textColor}`}>
                    {riskInfo.level} Risk
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {riskInfo.level === 'Low' && 'Low probability of irregularity. Continue monitoring your cycle.'}
                  {riskInfo.level === 'Medium' && 'Moderate indicators present. Consider consulting a healthcare provider.'}
                  {riskInfo.level === 'High' && 'Strong indicators of irregularity. Please consult a healthcare professional.'}
                </p>
              </div>
            </div>

            {isIrregular && irregularity_types && irregularity_types.length > 0 && (
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Detected Irregularity Types
                </h3>
                <ul className="space-y-3">
                  {irregularity_types.map((type, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-800 font-medium">{type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Information
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  This prediction is based on AI analysis of your provided health metrics. It is designed for informational and educational purposes only.
                </p>
                <p className="font-semibold text-gray-900 mt-3">
                  Always consult with qualified healthcare professionals for proper medical diagnosis, treatment, and advice regarding menstrual health concerns.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/predict')}
                className="flex-1 py-3 px-6 rounded-lg border-2 border-pink-500 text-pink-600 font-semibold hover:bg-pink-50 transition duration-200"
              >
                New Prediction
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:from-pink-600 hover:to-rose-700 transition duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
