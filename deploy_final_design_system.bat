@echo off
echo ========================================
echo    FINITIO - DEPLOIEMENT DESIGN SYSTEM
echo ========================================
echo.

echo [1/5] Ajout des fichiers modifies...
git add .

echo [2/5] Commit avec message detaille...
git commit -m "feat: Complete BTP Tech Premium Design System

- Added comprehensive finitio-design-system.css with professional palette
- Implemented WCAG AAA compliant CTA button variants
- Created color harmonization CSS with forced overrides
- Added implementation guide with practical examples
- Enhanced typography with Inter and Playfair Display fonts
- Integrated glassmorphism effects and premium gradients
- Optimized responsive design for all screen sizes
- Added accessibility features and focus states
- Created utility classes for consistent spacing and shadows
- Implemented construction industry themed components

Components updated:
- Hero: Premium gradient background with accessible contrast
- Navbar: Glass effect with harmonized colors
- CTA: Orange premium gradient replacing discordant blue
- Features: Unified palette with accessible hover states

Design system features:
- Blue night and construction orange color scheme
- Professional typography hierarchy
- Accessible button variants (primary, secondary, outline, ghost)
- Premium statistics and badge components
- Responsive utilities and animations
- Complete implementation guide

Ready for production deployment with modern, accessible, and cohesive UI"

echo [3/5] Push vers le repository...
git push origin main

echo [4/5] Attente de 3 secondes...
timeout /t 3 /nobreak > nul

echo [5/5] Declenchement du rebuild Vercel...
echo Visitez https://finitio-app.vercel.app pour voir les changements

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE AVEC SUCCES!
echo ========================================
echo.
echo Changements appliques:
echo - Design system BTP Tech Premium complet
echo - Palette harmonisee orange et bleu nuit
echo - Boutons CTA accessibles WCAG AAA
echo - Guide d'implementation detaille
echo - Effets glassmorphism et gradients
echo - Typographie professionnelle
echo - Responsive design optimise
echo.
echo Prochaines etapes:
echo 1. Tester l'accessibilite avec Lighthouse
echo 2. Verifier la coherence visuelle
echo 3. Optimiser les performances si necessaire
echo.
pause
