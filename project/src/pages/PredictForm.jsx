import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictIrregularity } from '../api/prediction';

const PredictForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    life_stage: 'reproductive',
    tracking_duration_months: '',
    pain_score: '',
    avg_cycle_length: '',
    cycle_length_variation: '',
    avg_bleeding_days: '',
    bleeding_volume_score: '',
    intermenstrual_episodes: '',
    cycle_variation_coeff: '',
    pattern_disruption_score: ''
  });

  const lifeStageOptions = [
    { value: 'reproductive', label: 'Reproductive Age' },
    { value: 'perimenopausal', label: 'Perimenopausal' },
    { value: 'postmenopausal', label: 'Postmenopausal' },
    { value: 'adolescent', label: 'Adolescent' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.age || formData.age < 10 || formData.age > 60) {
      newErrors.age = 'Age must be between 10 and 60';
    }

    if (!formData.bmi || formData.bmi < 10 || formData.bmi > 50) {
      newErrors.bmi = 'BMI must be between 10 and 50';
    }

    if (!formData.tracking_duration_months || formData.tracking_duration_months < 1 || formData.tracking_duration_months > 120) {
      newErrors.tracking_duration_months = 'Tracking duration must be between 1 and 120 months';
    }

    if (!formData.pain_score || formData.pain_score < 0 || formData.pain_score > 10) {
      newErrors.pain_score = 'Pain score must be between 0 and 10';
    }

    if (!formData.avg_cycle_length || formData.avg_cycle_length < 15 || formData.avg_cycle_length > 60) {
      newErrors.avg_cycle_length = 'Average cycle length must be between 15 and 60 days';
    }

    if (!formData.cycle_length_variation || formData.cycle_length_variation < 0 || formData.cycle_length_variation > 30) {
      newErrors.cycle_length_variation = 'Cycle length variation must be between 0 and 30 days';
    }

    if (!formData.avg_bleeding_days || formData.avg_bleeding_days < 1 || formData.avg_bleeding_days > 15) {
      newErrors.avg_bleeding_days = 'Average bleeding days must be between 1 and 15';
    }

    if (!formData.bleeding_volume_score || formData.bleeding_volume_score < 1 || formData.bleeding_volume_score > 5) {
      newErrors.bleeding_volume_score = 'Bleeding volume score must be between 1 and 5';
    }

    if (formData.intermenstrual_episodes === '' || formData.intermenstrual_episodes < 0 || formData.intermenstrual_episodes > 20) {
      newErrors.intermenstrual_episodes = 'Intermenstrual episodes must be between 0 and 20';
    }

    if (!formData.cycle_variation_coeff || formData.cycle_variation_coeff < 0 || formData.cycle_variation_coeff > 1) {
      newErrors.cycle_variation_coeff = 'Cycle variation coefficient must be between 0 and 1';
    }

    if (!formData.pattern_disruption_score || formData.pattern_disruption_score < 0 || formData.pattern_disruption_score > 10) {
      newErrors.pattern_disruption_score = 'Pattern disruption score must be between 0 and 10';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        age: parseFloat(formData.age),
        bmi: parseFloat(formData.bmi),
        life_stage: formData.life_stage,
        tracking_duration_months: parseInt(formData.tracking_duration_months),
        pain_score: parseFloat(formData.pain_score),
        avg_cycle_length: parseFloat(formData.avg_cycle_length),
        cycle_length_variation: parseFloat(formData.cycle_length_variation),
        avg_bleeding_days: parseFloat(formData.avg_bleeding_days),
        bleeding_volume_score: parseFloat(formData.bleeding_volume_score),
        intermenstrual_episodes: parseInt(formData.intermenstrual_episodes),
        cycle_variation_coeff: parseFloat(formData.cycle_variation_coeff),
        pattern_disruption_score: parseFloat(formData.pattern_disruption_score)
      };

      const result = await predictIrregularity(payload);
      navigate('/results', { state: { result } });
    } catch (error) {
      alert('Error making prediction. Please ensure the backend server is running at http://localhost:8000');
      console.error('Prediction error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormField = ({ label, name, type = "number", step, min, max, placeholder, tooltip }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {tooltip && (
          <span className="ml-2 text-xs text-gray-500">({tooltip})</span>
        )}
      </label>
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 outline-none`}
        >
          {lifeStageOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          step={step}
          min={min}
          max={max}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 outline-none`}
        />
      )}
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cycle Irregularity Prediction</h1>
            <p className="text-gray-600">Enter your health metrics to analyze menstrual cycle patterns</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Age"
                name="age"
                step="1"
                min="10"
                max="60"
                placeholder="e.g., 28"
                tooltip="10-60 years"
              />

              <FormField
                label="BMI (Body Mass Index)"
                name="bmi"
                step="0.1"
                min="10"
                max="50"
                placeholder="e.g., 22.5"
                tooltip="10-50"
              />

              <FormField
                label="Life Stage"
                name="life_stage"
                type="select"
              />

              <FormField
                label="Tracking Duration (Months)"
                name="tracking_duration_months"
                step="1"
                min="1"
                max="120"
                placeholder="e.g., 12"
                tooltip="1-120 months"
              />

              <FormField
                label="Pain Score"
                name="pain_score"
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g., 5.0"
                tooltip="0-10 scale"
              />

              <FormField
                label="Average Cycle Length (Days)"
                name="avg_cycle_length"
                step="1"
                min="15"
                max="60"
                placeholder="e.g., 28"
                tooltip="15-60 days"
              />

              <FormField
                label="Cycle Length Variation (Days)"
                name="cycle_length_variation"
                step="1"
                min="0"
                max="30"
                placeholder="e.g., 3"
                tooltip="0-30 days"
              />

              <FormField
                label="Average Bleeding Days"
                name="avg_bleeding_days"
                step="1"
                min="1"
                max="15"
                placeholder="e.g., 5"
                tooltip="1-15 days"
              />

              <FormField
                label="Bleeding Volume Score"
                name="bleeding_volume_score"
                step="1"
                min="1"
                max="5"
                placeholder="e.g., 3"
                tooltip="1-5 scale"
              />

              <FormField
                label="Intermenstrual Episodes"
                name="intermenstrual_episodes"
                step="1"
                min="0"
                max="20"
                placeholder="e.g., 0"
                tooltip="0-20 episodes"
              />

              <FormField
                label="Cycle Variation Coefficient"
                name="cycle_variation_coeff"
                step="0.01"
                min="0"
                max="1"
                placeholder="e.g., 0.15"
                tooltip="0-1 range"
              />

              <FormField
                label="Pattern Disruption Score"
                name="pattern_disruption_score"
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g., 2.5"
                tooltip="0-10 scale"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white text-lg font-semibold hover:from-pink-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Analyzing...' : 'Predict Irregularity'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All fields are required. Please ensure the backend server is running at http://localhost:8000 before submitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictForm;
