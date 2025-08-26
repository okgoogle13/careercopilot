import React from 'react';
import './TemplateSelector.css';

const templates = [
  {
    id: 'executive-professional',
    name: 'Executive Professional',
    previewImage: 'https://firebasestorage.googleapis.com/v0/b/your-project/o/assets%2Ftemplates%2Fexecutive-professional-preview.png?alt=media',
  },
  // ... other templates
];

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  return (
    <div className="template-selector">
      <h2>Select a Template</h2>
      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card" onClick={() => onSelectTemplate(template.id)}>
            <img src={template.previewImage} alt={template.name} />
            <p>{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
