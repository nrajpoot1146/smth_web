# smth_ui_flutter

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.


Folder Structure:
lib/
├── main.dart
│
├── app/
│   ├── app.dart               # MaterialApp / routing
│   ├── app_theme.dart         # Colors, text styles (HUD theme)
│   └── app_routes.dart        # Named routes
│
├── core/
│   ├── constants/
│   │   ├── colors.dart        # HUD colors (cyan, glow, danger)
│   │   ├── sizes.dart         # Padding, radius, stroke widths
│   │   ├── text_styles.dart   # Orbitron-style fonts
│   │   └── animations.dart   # Common animation durations
│   │
│   ├── utils/
│   │   ├── value_mapper.dart  # min/max → percentage
│   │   ├── formatters.dart    # Units, number formatting
│   │   └── extensions.dart   # Context, color helpers
│   │
│   └── services/
│       ├── websocket_service.dart
│       ├── mqtt_service.dart
│       └── sensor_simulator.dart
│
├── features/
│   ├── dashboard/
│   │   ├── dashboard_screen.dart
│   │   ├── dashboard_viewmodel.dart
│   │   └── widgets/
│   │       ├── pm_panel.dart
│   │       ├── gauge_grid.dart
│   │       └── status_strip.dart
│   │
│   ├── sensors/
│   │   ├── sensor_model.dart
│   │   ├── sensor_repository.dart
│   │   └── sensor_stream.dart
│   │
│   └── settings/
│       ├── settings_screen.dart
│       └── settings_viewmodel.dart
│
├── widgets/
│   ├── gauges/
│   │   ├── hud_gauge.dart
│   │   ├── semi_hud_gauge.dart
│   │   └── gauge_painter.dart
│   │
│   ├── indicators/
│   │   ├── hud_led.dart
│   │   ├── hud_ring_led.dart
│   │   └── signal_bar.dart
│   │
│   ├── controls/
│   │   ├── hud_toggle.dart
│   │   ├── hud_button.dart
│   │   └── rotary_knob.dart
│   │
│   ├── panels/
│   │   ├── pm_panel.dart
│   │   ├── info_panel.dart
│   │   └── alert_panel.dart
│   │
│   └── background/
│       ├── hud_background.dart
│       └── scanline_overlay.dart
│
├── data/
│   ├── models/
│   │   ├── pm_reading.dart
│   │   ├── sensor_status.dart
│   │   └── dashboard_state.dart
│   │
│   ├── repositories/
│   │   ├── sensor_repository_impl.dart
│   │   └── settings_repository.dart
│   │
│   └── sources/
│       ├── remote_source.dart
│       ├── local_source.dart
│       └── mock_source.dart
│
└── state/
    ├── providers/             # Riverpod / Provider
    │   ├── dashboard_provider.dart
    │   ├── sensor_provider.dart
    │   └── settings_provider.dart
    │
    └── blocs/                 # If using BLoC
        ├── dashboard_bloc.dart
        └── sensor_bloc.dart


## Data Flow
WebSocket / API
   ↓
Service
   ↓
Repository
   ↓
ViewModel / Provider
   ↓
Widget (Gauge / Panel)
