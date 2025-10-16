import { useState, useEffect } from 'react';

// Import sub-components
import {
  LoadingState,
  ErrorState,
  ConfigInspectorHeader,
  ConfigSidebar,
  ConfigToolbar,
  ConfigEditor,
  ValidationPanel,
  ConfigPreview
} from './components';

// Import types and utilities
import { ConfigFile, ConfigFilters } from './types/config.types';
import { 
  filterConfigs, 
  validateConfig, 
  detectLanguage,
  maskSecrets
} from './utils/config.utils';

// Import service
import { monorepoService } from '../../../services/monorepoService';

// Re-export types for backward compatibility
export type { ConfigFile, ConfigFilters } from './types/config.types';

export default function ConfigInspector() {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  
  // Selection and editing state
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  
  // UI state
  const [showSecrets, setShowSecrets] = useState(false);
  const [filters, setFilters] = useState<ConfigFilters>({
    section: 'all',
    type: 'all',
    status: 'all',
    search: ''
  });

  // Fetch configuration files
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        setLoading(true);
        const data = await monorepoService.getConfigurationFiles();
        
        // Transform the data to match our ConfigFile interface
        const transformedData: ConfigFile[] = data.map((file: any) => ({
          id: file.id || file.name,
          name: file.name,
          path: file.path || file.name,
          type: file.type || 'text',
          content: file.content || '',
          size: file.content?.length || 0,
          lastModified: file.lastModified || new Date().toISOString(),
          hasSecrets: file.hasSecrets || false,
          isEditable: file.isEditable !== false,
          validation: file.validation || []
        }));
        
        setConfigFiles(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch configuration files');
        console.error('Error fetching config files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigData();
  }, []);

  // Get filtered configurations
  const filteredConfigs = filterConfigs(configFiles, filters);
  
  // Get selected configuration
  const selectedConfigData = selectedConfig 
    ? configFiles.find(config => config.id === selectedConfig) || null 
    : null;

  // Event handlers
  const handleRefresh = () => {
    // Trigger a refresh of the data
    window.location.reload();
  };

  const handleConfigSelect = (configId: string) => {
    setSelectedConfig(configId);
    setIsEditing(false);
    setEditValue('');
  };

  const handleStartEdit = () => {
    if (selectedConfigData) {
      setIsEditing(true);
      setEditValue(selectedConfigData.content);
    }
  };

  const handleSaveEdit = () => {
    if (selectedConfigData) {
      // In a real implementation, this would save to the backend
      console.log('Saving config:', selectedConfigData.name, editValue);
      
      // Update local state
      setConfigFiles(prev => prev.map(config => 
        config.id === selectedConfig 
          ? { 
              ...config, 
              content: editValue,
              validation: validateConfig(editValue, config.name),
              lastModified: new Date().toISOString()
            }
          : config
      ));
      
      setIsEditing(false);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleToggleSecrets = () => {
    setShowSecrets(!showSecrets);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ConfigInspectorHeader onRefresh={handleRefresh} loading={loading} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ConfigSidebar
            configs={filteredConfigs}
            selectedConfig={selectedConfig}
            onConfigSelect={handleConfigSelect}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Toolbar */}
          {selectedConfigData && (
            <div className="mb-4">
              <ConfigToolbar
                isEditing={isEditing}
                canEdit={selectedConfigData.isEditable}
                hasSecrets={selectedConfigData.hasSecrets}
                showSecrets={showSecrets}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onToggleSecrets={handleToggleSecrets}
                onRefresh={handleRefresh}
              />
            </div>
          )}

          {/* Editor */}
          <div className="flex-1">
            <ConfigEditor
              config={selectedConfigData}
              isEditing={isEditing}
              editValue={editValue}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onValueChange={setEditValue}
              showSecrets={showSecrets}
              onToggleSecrets={handleToggleSecrets}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Validation Panel */}
          <ValidationPanel
            validation={selectedConfigData?.validation || []}
            configName={selectedConfigData?.name || 'No file selected'}
          />

          {/* Preview Panel */}
          {selectedConfigData && !isEditing && (
            <ConfigPreview
              content={selectedConfigData.content}
              language={detectLanguage(selectedConfigData.name)}
              showSecrets={showSecrets}
              onToggleSecrets={handleToggleSecrets}
            />
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredConfigs.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No configuration files found</h3>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.type !== 'all' || filters.status !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'No configuration files are available to inspect.'}
          </p>
          {(filters.search || filters.type !== 'all' || filters.status !== 'all') && (
            <button
              onClick={() => setFilters({ section: 'all', type: 'all', status: 'all', search: '' })}
              className="text-blue-600 hover:text-blue-500"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}