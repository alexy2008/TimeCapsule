import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:ui';
import 'api/api_client.dart';
import 'models/models.dart';
import 'utils/design_tokens.dart';
import 'utils/helpers.dart';

// 主题 Provider
final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.light) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDark = prefs.getBool('isDark') ?? false;
    state = isDark ? ThemeMode.dark : ThemeMode.light;
  }

  Future<void> toggleTheme() async {
    final isDark = state == ThemeMode.dark;
    state = isDark ? ThemeMode.light : ThemeMode.dark;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDark', !isDark);
  }
}

// 路由配置
final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    routes: [
      GoRoute(path: '/', builder: (context, state) => const HomeView()),
      GoRoute(path: '/create', builder: (context, state) => const CreateView()),
      GoRoute(
        path: '/open',
        builder: (context, state) => const OpenView(code: null),
        routes: [
          GoRoute(
            path: ':code',
            builder: (context, state) {
              final code = state.pathParameters['code'];
              return OpenView(code: code);
            },
          ),
        ],
      ),
      GoRoute(path: '/about', builder: (context, state) => const AboutView()),
      GoRoute(path: '/admin', builder: (context, state) => const AdminView()),
    ],
  );
});

void main() {
  runApp(const ProviderScope(child: HelloTimeApp()));
}

class HelloTimeApp extends ConsumerWidget {
  const HelloTimeApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeProvider);
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'HelloTime',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: _buildLightTheme(),
      darkTheme: _buildDarkTheme(),
      routerConfig: router,
      builder: (context, child) {
        return Stack(
          children: [
            const BackgroundEffects(),
            if (child != null) child,
          ],
        );
      },
    );
  }

  ThemeData _buildLightTheme() {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: DesignTokens.cyanLight,
      scaffoldBackgroundColor: DesignTokens.bgBaseLight,
      fontFamily: DesignTokens.fontFamilySans,
      colorScheme: ColorScheme.light(
        primary: DesignTokens.cyanLight,
        secondary: DesignTokens.magentaLight,
        surface: DesignTokens.glassBgLight,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      useMaterial3: true,
    );
  }

  ThemeData _buildDarkTheme() {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: DesignTokens.cyanDark,
      scaffoldBackgroundColor: DesignTokens.bgBaseDark,
      fontFamily: DesignTokens.fontFamilySans,
      colorScheme: ColorScheme.dark(
        primary: DesignTokens.cyanDark,
        secondary: DesignTokens.magentaDark,
        surface: DesignTokens.glassBgDark,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      useMaterial3: true,
    );
  }
}

// 背景特效
class BackgroundEffects extends StatelessWidget {
  const BackgroundEffects({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 网格背景
        Consumer(
          builder: (context, ref, child) {
            final brightness = Theme.of(context).brightness;
            return CustomPaint(
              size: Size.infinite,
              painter: GridPainter(brightness: brightness),
            );
          },
        ),
        // 中心光晕
        Center(
          child: TweenAnimationBuilder<double>(
            duration: const Duration(seconds: 4),
            tween: Tween(begin: 0.4, end: 0.7),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.6,
                  height: MediaQuery.of(context).size.height * 0.6,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        Theme.of(context).brightness == Brightness.dark
                            ? DesignTokens.cyanDimDark
                            : DesignTokens.cyanDimLight,
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class GridPainter extends CustomPainter {
  final Brightness brightness;
  
  GridPainter({this.brightness = Brightness.dark});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = brightness == Brightness.dark
          ? DesignTokens.bgGridDark
          : DesignTokens.bgGridLight
      ..strokeWidth = 1;

    const gridSize = 40.0;
    for (double x = 0; x < size.width; x += gridSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += gridSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// 首页
class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cyanColor = isDark ? DesignTokens.cyanDark : DesignTokens.cyanLight;

    return Scaffold(
      body: Column(
        children: [
          const AppHeader(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                children: [
                  const SizedBox(height: 40),
                  // Hero Section
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      border: Border.all(color: cyanColor.withOpacity(0.2)),
                      borderRadius: BorderRadius.circular(100),
                      color: cyanColor.withOpacity(0.05),
                    ),
                    child: Text(
                      'TIMECAPSULE SYSTEM',
                      style: TextStyle(
                        fontFamily: DesignTokens.fontFamilyMono,
                        fontSize: 12,
                        color: cyanColor,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    '封存此刻',
                    style: TextStyle(
                      fontSize: 56,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).textTheme.bodyLarge?.color,
                    ),
                  ),
                  Text(
                    '开启未来',
                    style: TextStyle(
                      fontSize: 56,
                      fontWeight: FontWeight.bold,
                      color: cyanColor,
                      shadows: [
                        Shadow(
                          color: cyanColor.withOpacity(0.5),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '将您的寄语、秘密或愿景封装于时间胶囊中\n直到指定的未来时刻才能被访问',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 18,
                      color: Theme.of(context).textTheme.bodyMedium?.color,
                    ),
                  ),
                  const SizedBox(height: 48),
                  // Action Cards
                  Row(
                    children: [
                      Expanded(
                        child: _ActionCard(
                          icon: Icons.add,
                          title: '创建胶囊',
                          subtitle: '封存此刻寄语，投递给未来的自己',
                          color: cyanColor,
                          onTap: () => context.go('/create'),
                        ),
                      ),
                      const SizedBox(width: 24),
                      Expanded(
                        child: _ActionCard(
                          icon: Icons.search,
                          title: '开启胶囊',
                          subtitle: '输入提取凭据，唤醒沉睡的时间印记',
                          color: isDark ? DesignTokens.magentaDark : DesignTokens.magentaLight,
                          onTap: () => context.go('/open'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 40),
                  // Tech Stack
                  const TechStackCard(),
                ],
              ),
            ),
          ),
          const AppFooter(),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: isDark ? DesignTokens.glassBgDark : DesignTokens.glassBgLight,
          borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
          border: Border.all(
            color: isDark ? DesignTokens.glassBorderDark : DesignTokens.glassBorderLight,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.4),
              blurRadius: 32,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.2),
                        blurRadius: 20,
                      ),
                    ],
                  ),
                  child: Icon(icon, color: color, size: 32),
                ),
                const SizedBox(height: 24),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: isDark ? DesignTokens.textSecondaryDark : DesignTokens.textSecondaryLight,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// 头部组件
class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  const AppHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cyanColor = isDark ? DesignTokens.cyanDark : DesignTokens.cyanLight;

    return AppBar(
      leading: IconButton(
        icon: const Icon(Icons.home),
        onPressed: () => context.go('/'),
        color: cyanColor,
      ),
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.lock_clock, color: cyanColor, size: 28),
          const SizedBox(width: 8),
          Text(
            'HelloTime',
            style: TextStyle(
              fontFamily: DesignTokens.fontFamilyMono,
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: cyanColor,
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => context.go('/about'),
          child: Text('关于', style: TextStyle(color: cyanColor)),
        ),
        Consumer(
          builder: (context, ref, child) {
            return IconButton(
              icon: Icon(ref.watch(themeProvider) == ThemeMode.dark
                  ? Icons.light_mode
                  : Icons.dark_mode),
              onPressed: () => ref.read(themeProvider.notifier).toggleTheme(),
            );
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

// 页脚组件
class AppFooter extends StatelessWidget {
  const AppFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: DesignTokens.greenNeonDark,
              boxShadow: [
                BoxShadow(
                  color: DesignTokens.greenNeonDark.withOpacity(0.5),
                  blurRadius: 8,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            'HelloTime · 时间胶囊 · Flutter 3 · Dart · Spring Boot · Java · SQLite',
            style: TextStyle(
              fontFamily: DesignTokens.fontFamilyMono,
              fontSize: 12,
              color: isDark ? DesignTokens.textSecondaryDark : DesignTokens.textSecondaryLight,
            ),
          ),
        ],
      ),
    );
  }
}

// 技术栈卡片
class TechStackCard extends StatelessWidget {
  const TechStackCard({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? DesignTokens.glassBgDark : DesignTokens.glassBgLight,
        borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
        border: Border.all(
          color: isDark ? DesignTokens.glassBorderDark : DesignTokens.glassBorderLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'TECHNOLOGY STACK',
            style: TextStyle(
              fontFamily: DesignTokens.fontFamilyMono,
              fontSize: 12,
              color: isDark ? DesignTokens.textMutedDark : DesignTokens.textMutedLight,
              letterSpacing: 3,
            ),
          ),
          const SizedBox(height: 16),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              TechItem(icon: 'assets/tech-logos/flutter.svg', label: 'Flutter'),
              TechItem(icon: 'assets/tech-logos/dart.svg', label: 'Dart'),
              TechItem(icon: 'http://localhost:8080/tech-logos/backend.svg', label: '后端'),
              TechItem(icon: 'http://localhost:8080/tech-logos/language.svg', label: '语言'),
              TechItem(icon: 'http://localhost:8080/tech-logos/database.svg', label: '数据库'),
            ],
          ),
        ],
      ),
    );
  }
}

class TechItem extends StatelessWidget {
  final String icon;
  final String label;

  const TechItem({super.key, required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(Icons.code, size: 28),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}

// 创建视图
class CreateView extends StatefulWidget {
  const CreateView({super.key});

  @override
  State<CreateView> createState() => _CreateViewState();
}

class _CreateViewState extends State<CreateView> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final _creatorController = TextEditingController();
  DateTime? _selectedDate;
  bool _loading = false;
  String? _error;
  Capsule? _created;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _selectedDate == null) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final api = ApiClient();
      final form = CreateCapsuleForm(
        title: _titleController.text,
        content: _contentController.text,
        creator: _creatorController.text,
        openAt: _selectedDate!,
      );
      final result = await api.createCapsule(form);
      setState(() => _created = result);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_created != null) {
      return Scaffold(
        appBar: const AppHeader(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.check_circle, color: Colors.green, size: 64),
              const SizedBox(height: 24),
              const Text('胶囊创建成功', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              Text('胶囊码: ${_created!.code}',
                  style: const TextStyle(fontSize: 32, fontFamily: DesignTokens.fontFamilyMono)),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/'),
                child: const Text('返回首页'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: const AppHeader(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              if (_error != null)
                Text(_error!, style: const TextStyle(color: Colors.red)),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: '标题'),
                validator: (v) => v!.isEmpty ? '请输入标题' : null,
              ),
              TextFormField(
                controller: _contentController,
                decoration: const InputDecoration(labelText: '内容'),
                maxLines: 5,
                validator: (v) => v!.isEmpty ? '请输入内容' : null,
              ),
              TextFormField(
                controller: _creatorController,
                decoration: const InputDecoration(labelText: '创建者'),
                validator: (v) => v!.isEmpty ? '请输入创建者' : null,
              ),
              ListTile(
                title: Text(_selectedDate == null
                    ? '选择开启时间'
                    : '开启时间: ${_selectedDate!.toString().split('.')[0]}'),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now().add(const Duration(days: 1)),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 3650)),
                  );
                  if (date != null) setState(() => _selectedDate = date);
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const CircularProgressIndicator()
                    : const Text('创建胶囊'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// 开启视图
class OpenView extends StatefulWidget {
  final String? code;
  const OpenView({super.key, this.code});

  @override
  State<OpenView> createState() => _OpenViewState();
}

class _OpenViewState extends State<OpenView> {
  final _controller = TextEditingController();
  Capsule? _capsule;
  String? _error;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    if (widget.code != null) {
      _controller.text = widget.code!;
      _loadCapsule(widget.code!);
    }
  }

  Future<void> _loadCapsule(String code) async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final api = ApiClient();
      final capsule = await api.getCapsule(code);
      setState(() => _capsule = capsule);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppHeader(),
      body: Center(
        child: _capsule == null
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('输入胶囊码', style: TextStyle(fontSize: 24)),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: 300,
                    child: TextField(
                      controller: _controller,
                      decoration: const InputDecoration(
                        labelText: '胶囊码',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loading
                        ? null
                        : () => _loadCapsule(_controller.text),
                    child: _loading
                        ? const CircularProgressIndicator()
                        : const Text('查询'),
                  ),
                ],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('胶囊: ${_capsule!.code}', style: const TextStyle(fontSize: 24)),
                  Text('标题: ${_capsule!.title}'),
                  if (_capsule!.content != null)
                    Text('内容: ${_capsule!.content}')
                  else
                    const Text('内容: 未解锁'),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => context.go('/'),
                    child: const Text('返回首页'),
                  ),
                ],
              ),
      ),
    );
  }
}

// 关于视图
class AboutView extends StatelessWidget {
  const AboutView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppHeader(),
      body: const Center(
        child: Text(
          '关于 HelloTime 时间胶囊',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

// 管理视图
class AdminView extends StatelessWidget {
  const AdminView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppHeader(),
      body: const Center(
        child: Text(
          '管理员面板',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
