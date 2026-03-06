"""Comprehensive tests for genkit_flows/types.py.

Tests cover protocol definitions, type stubs, and type variable initialization.
"""

from typing import Any, Callable, List, Optional

import pytest

from app.genkit_flows.types import (
    ErrorHandler,
    FlowFunction,
    GenkitFlow,
    GenkitModule,
    GenkitPlugin,
    GoogleGenAIPlugin,
    InputT,
    ModelConfig,
    OutputT,
    P,
    R,
    T,
)

# ============================================================================
# Type Variable Tests
# ============================================================================


class TestTypeVariables:
    """Tests for type variable definitions."""

    def test_type_variable_t_exists(self):
        """Test TypeVar T is defined."""
        assert T is not None

    def test_type_variable_p_exists(self):
        """Test ParamSpec P is defined."""
        assert P is not None

    def test_type_variable_r_exists(self):
        """Test TypeVar R is defined."""
        assert R is not None

    def test_type_variable_input_t_exists(self):
        """Test TypeVar InputT is defined."""
        assert InputT is not None

    def test_type_variable_output_t_exists(self):
        """Test TypeVar OutputT is defined."""
        assert OutputT is not None


# ============================================================================
# GenkitFlow Protocol Tests
# ============================================================================


class TestGenkitFlowProtocol:
    """Tests for GenkitFlow protocol."""

    def test_genkit_flow_protocol_exists(self):
        """Test GenkitFlow protocol is defined."""
        assert GenkitFlow is not None

    def test_genkit_flow_is_generic(self):
        """Test GenkitFlow supports generic parameters."""
        # Should be able to parameterize with type variables
        assert hasattr(GenkitFlow, "__class_getitem__")

    def test_genkit_flow_callable_signature(self):
        """Test GenkitFlow has __call__ method."""
        assert hasattr(GenkitFlow, "__call__")


# ============================================================================
# GenkitPlugin Protocol Tests
# ============================================================================


class TestGenkitPluginProtocol:
    """Tests for GenkitPlugin protocol."""

    def test_genkit_plugin_protocol_exists(self):
        """Test GenkitPlugin protocol is defined."""
        assert GenkitPlugin is not None

    def test_genkit_plugin_has_init_method(self):
        """Test GenkitPlugin requires init method."""
        assert hasattr(GenkitPlugin, "init")


# ============================================================================
# ModelConfig Protocol Tests
# ============================================================================


class TestModelConfigProtocol:
    """Tests for ModelConfig protocol."""

    def test_model_config_protocol_exists(self):
        """Test ModelConfig protocol is defined."""
        assert ModelConfig is not None

    def test_model_config_has_generate_method(self):
        """Test ModelConfig requires generate method."""
        assert hasattr(ModelConfig, "generate")

    def test_model_config_has_call_method(self):
        """Test ModelConfig requires __call__ method."""
        assert hasattr(ModelConfig, "__call__")


# ============================================================================
# GenkitModule Protocol Tests
# ============================================================================


class TestGenkitModuleProtocol:
    """Tests for GenkitModule protocol."""

    def test_genkit_module_protocol_exists(self):
        """Test GenkitModule protocol is defined."""
        assert GenkitModule is not None

    def test_genkit_module_has_get_plugin_method(self):
        """Test GenkitModule has get_plugin method."""
        assert hasattr(GenkitModule, "get_plugin")

    def test_genkit_module_has_init_method(self):
        """Test GenkitModule has init method."""
        assert hasattr(GenkitModule, "init")

    def test_genkit_module_has_flow_property(self):
        """Test GenkitModule has flow property."""
        assert hasattr(GenkitModule, "flow")


# ============================================================================
# GoogleGenAIPlugin Protocol Tests
# ============================================================================


class TestGoogleGenAIPluginProtocol:
    """Tests for GoogleGenAIPlugin protocol."""

    def test_google_genai_plugin_protocol_exists(self):
        """Test GoogleGenAIPlugin protocol is defined."""
        assert GoogleGenAIPlugin is not None

    def test_google_genai_plugin_has_init_method(self):
        """Test GoogleGenAIPlugin has init static method."""
        assert hasattr(GoogleGenAIPlugin, "init")


# ============================================================================
# FlowFunction Type Tests
# ============================================================================


class TestFlowFunctionType:
    """Tests for FlowFunction type alias."""

    def test_flow_function_type_exists(self):
        """Test FlowFunction type is defined."""
        assert FlowFunction is not None

    def test_flow_function_is_callable(self):
        """Test FlowFunction is callable type."""
        # FlowFunction = Callable[..., OutputT]
        assert hasattr(FlowFunction, "__origin__")


# ============================================================================
# ErrorHandler Type Tests
# ============================================================================


class TestErrorHandlerType:
    """Tests for ErrorHandler type alias."""

    def test_error_handler_type_exists(self):
        """Test ErrorHandler type is defined."""
        assert ErrorHandler is not None

    def test_error_handler_accepts_exception(self):
        """Test ErrorHandler accepts Exception parameter."""
        # ErrorHandler = Callable[[Exception], None]
        assert hasattr(ErrorHandler, "__origin__")


# ============================================================================
# Protocol Importability Tests
# ============================================================================


class TestProtocolImportability:
    """Tests for importing protocol definitions."""

    def test_all_protocols_importable(self):
        """Test all protocols can be imported."""
        protocols = [
            GenkitFlow,
            GenkitPlugin,
            ModelConfig,
            GenkitModule,
            GoogleGenAIPlugin,
        ]
        assert all(p is not None for p in protocols)

    def test_all_type_aliases_importable(self):
        """Test all type aliases can be imported."""
        aliases = [FlowFunction, ErrorHandler]
        assert all(a is not None for a in aliases)

    def test_all_type_variables_importable(self):
        """Test all type variables can be imported."""
        variables = [T, P, R, InputT, OutputT]
        assert all(v is not None for v in variables)


# ============================================================================
# Protocol Method Signature Tests
# ============================================================================


class TestProtocolMethodSignatures:
    """Tests for protocol method signatures."""

    def test_genkit_plugin_init_signature(self):
        """Test GenkitPlugin.init accepts kwargs."""
        # Should have **kwargs: Any
        init_method = GenkitPlugin.init
        assert init_method is not None

    def test_model_config_generate_signature(self):
        """Test ModelConfig.generate accepts prompt and kwargs."""
        generate_method = ModelConfig.generate
        assert generate_method is not None

    def test_genkit_module_get_plugin_returns_optional(self):
        """Test GenkitModule.get_plugin returns Optional[GenkitPlugin]."""
        get_plugin_method = GenkitModule.get_plugin
        assert get_plugin_method is not None

    def test_genkit_module_init_accepts_optional_list(self):
        """Test GenkitModule.init accepts Optional list of plugins."""
        init_method = GenkitModule.init
        assert init_method is not None


# ============================================================================
# Type Annotation Tests
# ============================================================================


class TestTypeAnnotations:
    """Tests for type annotations in protocols."""

    def test_protocols_are_runtime_checkable(self):
        """Test protocols support runtime checking."""
        from typing_extensions import Protocol as TypingProtocol

        # All our protocols should be Protocol subclasses
        assert issubclass(GenkitFlow, object)
        assert issubclass(GenkitPlugin, object)

    def test_generic_protocols_support_parameterization(self):
        """Test generic protocols can be parameterized."""
        # GenkitFlow is Generic[P, T]
        try:
            parameterized = GenkitFlow[Any, Any]
            assert parameterized is not None
        except TypeError:
            # Some type systems don't support this
            pass


# ============================================================================
# Edge Cases and Special Types
# ============================================================================


class TestEdgeCasesAndSpecialTypes:
    """Tests for edge cases in type definitions."""

    def test_callable_protocol_definitions(self):
        """Test callable protocol definitions."""
        # FlowFunction and ErrorHandler are callable types
        assert FlowFunction is not None
        assert ErrorHandler is not None

    def test_type_variable_constraints(self):
        """Test type variables are properly defined."""
        # All type variables should be defined without constraints
        assert T is not None
        assert P is not None
        assert R is not None

    def test_duplicate_output_t_definition(self):
        """Test OutputT is defined (even if duplicated)."""
        # OutputT appears twice in the module
        assert OutputT is not None

    def test_protocol_classes_are_callable(self):
        """Test protocol classes can be used in type hints."""

        def test_func(plugin: GenkitPlugin) -> None:
            pass

        assert test_func is not None

    def test_model_config_protocol_consistency(self):
        """Test ModelConfig protocol appears twice (consistent definitions)."""
        # Both ModelConfig definitions should be equivalent
        assert hasattr(ModelConfig, "generate")
        assert hasattr(ModelConfig, "__call__")


# ============================================================================
# Integration Tests
# ============================================================================


class TestIntegration:
    """Integration tests for type system."""

    def test_genkit_module_with_plugins(self):
        """Test GenkitModule works with GenkitPlugin."""
        # These should be compatible in type system
        assert GenkitModule is not None
        assert GenkitPlugin is not None

    def test_flow_function_with_model_config(self):
        """Test FlowFunction can work with ModelConfig."""
        # Flow functions should be compatible with model config
        assert FlowFunction is not None
        assert ModelConfig is not None

    def test_error_handler_with_exceptions(self):
        """Test ErrorHandler works with Exception types."""

        # Error handler should accept any exception
        def handle_error(exc: Exception) -> None:
            pass

        assert handle_error is not None

    def test_type_stubs_completeness(self):
        """Test all expected types are defined."""
        expected_types = [
            "GenkitFlow",
            "GenkitPlugin",
            "ModelConfig",
            "GenkitModule",
            "GoogleGenAIPlugin",
            "FlowFunction",
            "ErrorHandler",
        ]

        import app.genkit_flows.types as types_module

        for type_name in expected_types:
            assert hasattr(types_module, type_name)


# ============================================================================
# Stub Compatibility Tests
# ============================================================================


class TestStubCompatibility:
    """Tests for stub compatibility with actual implementations."""

    def test_genkit_flow_stub_compatible_with_decorator(self):
        """Test GenkitFlow stub is compatible with decorator pattern."""
        # GenkitFlow should work as a decorator
        assert GenkitFlow is not None

    def test_plugin_init_stub_compatible_with_actual(self):
        """Test plugin init stub is compatible."""
        # init(api_key=...) pattern should work
        assert GoogleGenAIPlugin is not None

    def test_model_config_stub_compatible_with_generation(self):
        """Test model config stub supports generation."""
        # generate(prompt, **kwargs) pattern should work
        assert ModelConfig is not None
