"""
Token Orchestrator Engine - Component Parser & Token Mapper
Phase 3 automation for Northcote Curio token integration
"""

import re
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple

@dataclass
class HardcodedValue:
    """Represents a hardcoded value found in component"""
    type: str  # 'color', 'spacing', 'shape', 'motion'
    value: str  # The actual hardcoded value
    line_number: int
    context: str  # Code context where found
    token_mapping: Optional[str] = None  # Mapped token path
    confidence: float = 0.0  # Confidence score 0-1.0

class ComponentParser:
    """Parse React component files for hardcoded values"""
    
    HEX_COLOR_PATTERN = r'#[0-9A-Fa-f]{6}\b'
    BORDER_RADIUS_PATTERN = r'borderRadius:\s*[\'"]?(\d+px|[\d.]+rem)'
    SPACING_PATTERN = r'(padding|margin|gap):\s*[\'"]?(\d+px|[\d.]+rem)'
    TRANSITION_PATTERN = r'transition:\s*[\'"]?([^\'";]+)'
    
    def __init__(self, component_code: str):
        self.code = component_code
        self.lines = component_code.split('\n')
    
    def parse(self) -> List[HardcodedValue]:
        """Parse component and return all hardcoded values"""
        hardcoded = []
        
        for line_num, line in enumerate(self.lines, 1):
            # Colors
            for match in re.finditer(self.HEX_COLOR_PATTERN, line):
                hardcoded.append(HardcodedValue(
                    type='color',
                    value=match.group(),
                    line_number=line_num,
                    context=line.strip()
                ))
            
            # Spacing
            for match in re.finditer(self.SPACING_PATTERN, line):
                hardcoded.append(HardcodedValue(
                    type='spacing',
                    value=match.group(2),
                    line_number=line_num,
                    context=line.strip()
                ))
            
            # Border radius
            for match in re.finditer(self.BORDER_RADIUS_PATTERN, line):
                hardcoded.append(HardcodedValue(
                    type='shape',
                    value=match.group(1),
                    line_number=line_num,
                    context=line.strip()
                ))
            
            # Motion
            for match in re.finditer(self.TRANSITION_PATTERN, line):
                hardcoded.append(HardcodedValue(
                    type='motion',
                    value=match.group(1),
                    line_number=line_num,
                    context=line.strip()
                ))
        
        return hardcoded

class TokenMapper:
    """Map hardcoded values to design tokens"""
    
    def __init__(self, tokens: Dict):
        self.tokens = tokens
        self.color_map = tokens.get('colors', {})
        self.spacing_map = tokens.get('spacing', {})
        self.shape_map = tokens.get('shape', {})
        self.motion_map = tokens.get('motion', {})
    
    def map_value(self, hardcoded: HardcodedValue) -> Tuple[Optional[str], float]:
        """Map hardcoded value to token, return (token_path, confidence)"""
        if hardcoded.type == 'color':
            return self._map_color(hardcoded.value)
        elif hardcoded.type == 'spacing':
            return self._map_spacing(hardcoded.value)
        elif hardcoded.type == 'shape':
            return self._map_shape(hardcoded.value)
        elif hardcoded.type == 'motion':
            return self._map_motion(hardcoded.value)
        return None, 0.0
    
    def _map_color(self, color_value: str) -> Tuple[Optional[str], float]:
        """Map hex color to token"""
        for token_path, token_value in self.color_map.items():
            if token_value.lower() == color_value.lower():
                return token_path, 1.0  # Exact match
        return None, 0.0
    
    def _map_spacing(self, spacing_value: str) -> Tuple[Optional[str], float]:
        """Map spacing to token"""
        for token_path, token_value in self.spacing_map.items():
            if token_value == spacing_value:
                return token_path, 1.0
        return None, 0.5  # Partial match
    
    def _map_shape(self, shape_value: str) -> Tuple[Optional[str], float]:
        """Map border radius to token"""
        for token_path, token_value in self.shape_map.items():
            if token_value == shape_value:
                return token_path, 1.0
        return None, 0.5
    
    def _map_motion(self, motion_value: str) -> Tuple[Optional[str], float]:
        """Map motion to token"""
        for token_path, token_value in self.motion_map.items():
            if token_value in motion_value:
                return token_path, 0.8
        return None, 0.3

class ComponentOrchestrator:
    """Orchestrate full audit → mapping → code generation"""
    
    def __init__(self, tokens: Dict):
        self.tokens = tokens
    
    def audit_component(self, component_path: str, component_code: str) -> Dict:
        """Complete audit of single component"""
        parser = ComponentParser(component_code)
        mapper = TokenMapper(self.tokens)
        
        hardcoded = parser.parse()
        
        for value in hardcoded:
            token_path, confidence = mapper.map_value(value)
            value.token_mapping = token_path
            value.confidence = confidence
        
        return {
            'path': component_path,
            'hardcoded_values': hardcoded,
            'total_found': len(hardcoded),
            'mappable': sum(1 for v in hardcoded if v.token_mapping),
            'coverage': f"{sum(1 for v in hardcoded if v.token_mapping) / len(hardcoded) * 100:.1f}%" if hardcoded else "N/A"
        }
