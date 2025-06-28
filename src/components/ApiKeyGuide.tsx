import React from 'react';
import { AlertCircle, ExternalLink, CreditCard, Key, Zap, DollarSign } from 'lucide-react';

interface ApiKeyGuideProps {
  error?: string;
  provider: 'openai' | 'deepseek' | 'openrouter';
}

export const ApiKeyGuide: React.FC<ApiKeyGuideProps> = ({ error, provider }) => {
  const isRateLimitError = error?.includes('Rate limit exceeded');
  const isAuthError = error?.includes('Invalid API key');

  const providerInfo = {
    openai: {
      name: 'OpenAI',
      url: 'https://platform.openai.com/api-keys',
      billingUrl: 'https://platform.openai.com/account/billing',
      usageUrl: 'https://platform.openai.com/usage',
      envVar: 'VITE_OPENAI_API_KEY',
      needsBilling: true,
      color: 'green'
    },
    deepseek: {
      name: 'DeepSeek',
      url: 'https://platform.deepseek.com/api_keys',
      billingUrl: 'https://platform.deepseek.com/account/billing',
      usageUrl: 'https://platform.deepseek.com/usage',
      envVar: 'VITE_DEEPSEEK_API_KEY',
      needsBilling: false,
      color: 'blue'
    },
    openrouter: {
      name: 'OpenRouter',
      url: 'https://openrouter.ai/keys',
      billingUrl: 'https://openrouter.ai/credits',
      usageUrl: 'https://openrouter.ai/activity',
      envVar: 'VITE_OPENROUTER_API_KEY',
      needsBilling: false,
      color: 'purple'
    }
  };

  const info = providerInfo[provider];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="text-orange-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          {isRateLimitError ? 'Rate Limit Exceeded' : `${info.name} API Key Setup`}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {(provider === 'deepseek' || provider === 'openrouter') && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">
              Why Choose {provider === 'deepseek' ? 'DeepSeek' : 'OpenRouter'}?
            </h3>
          </div>
          {provider === 'deepseek' ? (
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>$5 free credits monthly</strong> (much more generous than OpenAI)</li>
              <li>• <strong>Lower costs</strong> for paid usage</li>
              <li>• <strong>Good performance</strong> comparable to GPT-3.5/4</li>
              <li>• <strong>No phone verification required</strong></li>
            </ul>
          ) : (
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Free tier with generous limits</strong></li>
              <li>• <strong>Access to multiple AI models</strong> including DeepSeek R1</li>
              <li>• <strong>Competitive pricing</strong> often cheaper than direct providers</li>
              <li>• <strong>No billing required</strong> for free tier usage</li>
              <li>• <strong>Easy model switching</strong> - try different models with one API</li>
            </ul>
          )}
        </div>
      )}

      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <Key size={16} />
            Step 1: Get Your {info.name} API Key
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Visit <a href={info.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">{info.name} API Keys <ExternalLink size={12} /></a></li>
            <li>Sign in to your {info.name} account (create one if needed)</li>
            <li>Click "Create new secret key" or "New API Key"</li>
            <li>Copy the key (it starts with "sk-")</li>
          </ol>
        </div>

        {info.needsBilling && (
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <CreditCard size={16} />
              Step 2: Add Billing Information
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Important for OpenAI!</span>
              </div>
              <p className="text-sm text-yellow-700">
                OpenAI requires billing information to use the API, even for small amounts.
              </p>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Go to <a href={info.billingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Billing Settings <ExternalLink size={12} /></a></li>
              <li>Add a payment method</li>
              <li>Set usage limits to control costs</li>
            </ol>
          </div>
        )}

        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-semibold text-gray-800 mb-2">Step {info.needsBilling ? '3' : '2'}: Update Your .env File</h3>
          <p className="text-sm text-gray-600 mb-2">
            Replace the API key in your <code className="bg-gray-100 px-1 rounded">.env</code> file:
          </p>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono">
            {info.envVar}=sk-your-actual-api-key-here
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ Never commit your API key to version control! Restart the dev server after making changes.
          </p>
        </div>

        {isRateLimitError && (
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Rate Limit Solutions</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Check your usage at <a href={info.usageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">{info.name} Usage Dashboard <ExternalLink size={12} /></a></li>
              {info.needsBilling && <li>Add billing information to increase limits</li>}
              <li>Wait a few minutes before trying again</li>
              {info.needsBilling && <li>Consider upgrading to a paid plan for higher limits</li>}
            </ul>
          </div>
        )}

        <div className={`bg-${info.color}-50 border border-${info.color}-200 rounded-lg p-4`}>
          <h4 className={`font-semibold text-${info.color}-800 mb-2`}>
            {provider === 'openrouter' ? 'OpenRouter Benefits' : provider === 'deepseek' ? 'DeepSeek Benefits' : 'Cost Information'}
          </h4>
          {provider === 'openrouter' ? (
            <ul className={`text-sm text-${info.color}-700 space-y-1`}>
              <li>• <strong>Free tier with generous limits</strong></li>
              <li>• <strong>DeepSeek R1 model available for free</strong></li>
              <li>• <strong>Access to 100+ AI models</strong> in one place</li>
              <li>• <strong>Often cheaper than direct providers</strong></li>
              <li>• <strong>Easy model comparison and switching</strong></li>
            </ul>
          ) : provider === 'deepseek' ? (
            <ul className={`text-sm text-${info.color}-700 space-y-1`}>
              <li>• <strong>$5 monthly free credits</strong> (much more than OpenAI's $5 one-time)</li>
              <li>• Significantly cheaper rates for paid usage</li>
              <li>• No billing required for free tier</li>
              <li>• API compatible with OpenAI format</li>
            </ul>
          ) : (
            <ul className={`text-sm text-${info.color}-700 space-y-1`}>
              <li>• GPT-3.5-turbo: ~$0.002 per 1K tokens (very affordable)</li>
              <li>• Most conversations cost less than $0.01</li>
              <li>• Set usage limits to control costs</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
