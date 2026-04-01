
import 'package:flutter/material.dart';

void main() {
  runApp(const FreshCatchApp());
}

class FreshCatchApp extends StatelessWidget {
  const FreshCatchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FreshCatch NG',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF0B4F6C),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final items = const [
      {'name': 'Catfish', 'price': '₦6,500/kg'},
      {'name': 'Tilapia', 'price': '₦5,800/kg'},
      {'name': 'Croaker', 'price': '₦8,500/kg'},
      {'name': 'Prawns', 'price': '₦12,000/kg'},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('FreshCatch NG')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Order Fresh Seafood in Lagos',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text('Mobile-ready starter for storefront, cart, and future admin features.'),
          const SizedBox(height: 20),
          ...items.map((item) => Card(
            child: ListTile(
              title: Text(item['name']!),
              subtitle: Text(item['price']!),
              trailing: ElevatedButton(
                onPressed: () {},
                child: const Text('Add'),
              ),
            ),
          )),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () {},
            child: const Text('Proceed to Cart'),
          ),
        ],
      ),
    );
  }
}
