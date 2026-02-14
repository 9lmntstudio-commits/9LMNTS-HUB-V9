#!/usr/bin/env python3
"""
🔒 Security Audit Script
Scans codebase for security vulnerabilities and hardcoded secrets
"""

import sys
import os
import re
from pathlib import Path
from typing import List, Dict, Any

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

try:
    from utils.logger import logger
    from utils.error_handler import ErrorHandler
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

class SecurityAuditor:
    """Security vulnerability scanner"""
    
    def __init__(self):
        self.project_root = project_root
        self.issues_found = []
        
        # Patterns to detect
        self.secret_patterns = [
            (r'sk-[a-zA-Z0-9]{48}', 'OpenAI API Key'),
            (r'ntn_[a-zA-Z0-9]{32}', 'Notion API Key'),
            (r'AIza[a-zA-Z0-9_-]{35}', 'Google Gemini API Key'),
            (r'ghp_[a-zA-Z0-9]{36}', 'GitHub Personal Access Token'),
            (r'figd_[a-zA-Z0-9_-]{43}', 'Figma API Key'),
            (r'[a-zA-Z0-9]{8}:[a-zA-Z0-9]{32}', 'ManyChat API Key'),
            (r'AQ\.[a-zA-Z0-9_-]{48}', 'Stitch AI API Key'),
            (r'odzf [a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4}', 'Google App Password'),
            (r'eyJ[a-zA-Z0-9._-]{150,}', 'JWT Token'),
            (r'[a-zA-Z0-9_-]{40,}', 'Generic API Key')
        ]
        
        self.insecure_patterns = [
            (r'http://[^s]', 'Insecure HTTP URL'),
            (r'eval\(', 'Code Injection Risk'),
            (r'exec\(', 'Code Execution Risk'),
            (r'shell_exec', 'Shell Command Risk'),
            (r'subprocess\.call\(.*shell=True', 'Unsafe Shell Execution')
        ]
    
    def scan_file_for_secrets(self, file_path: Path) -> List[Dict[str, Any]]:
        """Scan individual file for hardcoded secrets"""
        issues = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                lines = content.split('\n')
                
                for line_num, line in enumerate(lines, 1):
                    # Skip comments and environment variable assignments
                    stripped_line = line.strip()
                    if (stripped_line.startswith('#') or 
                        stripped_line.startswith('//') or
                        'os.getenv(' in line or
                        'os.environ[' in line):
                        continue
                    
                    # Check for secrets
                    for pattern, secret_type in self.secret_patterns:
                        matches = re.findall(pattern, line)
                        for match in matches:
                            issues.append({
                                'file': str(file_path.relative_to(self.project_root)),
                                'line': line_num,
                                'type': 'hardcoded_secret',
                                'secret_type': secret_type,
                                'content': match[:20] + '...' if len(match) > 20 else match,
                                'severity': 'HIGH'
                            })
        
        except Exception as e:
            logger.error(f"Error scanning file {file_path}: {e}")
        
        return issues
    
    def scan_file_for_insecure_patterns(self, file_path: Path) -> List[Dict[str, Any]]:
        """Scan file for insecure coding patterns"""
        issues = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                lines = content.split('\n')
                
                for line_num, line in enumerate(lines, 1):
                    for pattern, issue_type in self.insecure_patterns:
                        matches = re.findall(pattern, line)
                        for match in matches:
                            issues.append({
                                'file': str(file_path.relative_to(self.project_root)),
                                'line': line_num,
                                'type': 'insecure_pattern',
                                'issue_type': issue_type,
                                'content': match[:30] + '...' if len(match) > 30 else match,
                                'severity': 'MEDIUM'
                            })
        
        except Exception as e:
            logger.error(f"Error scanning file {file_path}: {e}")
        
        return issues
    
    def check_file_permissions(self) -> List[Dict[str, Any]]:
        """Check file permissions for security"""
        issues = []
        
        # Check .env file permissions
        env_file = self.project_root / '.env'
        if env_file.exists():
            stat = env_file.stat()
            mode = oct(stat.st_mode)[-3:]
            
            # .env should only be readable by owner
            if mode != '600':
                issues.append({
                    'file': '.env',
                    'type': 'file_permissions',
                    'issue_type': 'Insecure .env permissions',
                    'content': f'Current permissions: {mode}, Should be: 600',
                    'severity': 'MEDIUM'
                })
        
        # Check for world-writable files
        for file_path in self.project_root.rglob('*.py'):
            if file_path.is_file():
                stat = file_path.stat()
                mode = oct(stat.st_mode)[-3:]
                if mode.endswith('2') or mode.endswith('7'):
                    issues.append({
                        'file': str(file_path.relative_to(self.project_root)),
                        'type': 'file_permissions',
                        'issue_type': 'World-writable file',
                        'content': f'Permissions: {mode}',
                        'severity': 'MEDIUM'
                    })
        
        return issues
    
    def check_ssl_certificates(self) -> List[Dict[str, Any]]:
        """Check for SSL certificate issues"""
        issues = []
        
        # Check hardcoded HTTPS URLs that might have certificate issues
        for file_path in self.project_root.rglob('*.py'):
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    
                    # Look for hardcoded URLs that skip SSL verification
                    if 'verify=False' in content or 'ssl_verify=False' in content:
                        issues.append({
                            'file': str(file_path.relative_to(self.project_root)),
                            'type': 'ssl_issue',
                            'issue_type': 'SSL Verification Disabled',
                            'content': 'SSL certificate verification disabled',
                            'severity': 'HIGH'
                        })
            except Exception:
                continue
        
        return issues
    
    def run_security_scan(self) -> Dict[str, Any]:
        """Run comprehensive security scan"""
        logger.info("Starting security audit...")
        
        all_issues = []
        files_scanned = 0
        
        # Scan Python files
        for file_path in self.project_root.rglob('*.py'):
            if 'node_modules' in str(file_path) or '.git' in str(file_path):
                continue
            
            files_scanned += 1
            
            # Scan for secrets
            secret_issues = self.scan_file_for_secrets(file_path)
            all_issues.extend(secret_issues)
            
            # Scan for insecure patterns
            pattern_issues = self.scan_file_for_insecure_patterns(file_path)
            all_issues.extend(pattern_issues)
        
        # Check file permissions
        permission_issues = self.check_file_permissions()
        all_issues.extend(permission_issues)
        
        # Check SSL issues
        ssl_issues = self.check_ssl_certificates()
        all_issues.extend(ssl_issues)
        
        # Categorize issues
        high_severity = [i for i in all_issues if i['severity'] == 'HIGH']
        medium_severity = [i for i in all_issues if i['severity'] == 'MEDIUM']
        
        return {
            'total_issues': len(all_issues),
            'high_severity': len(high_severity),
            'medium_severity': len(medium_severity),
            'files_scanned': files_scanned,
            'issues': all_issues,
            'summary': {
                'hardcoded_secrets': len([i for i in all_issues if i['type'] == 'hardcoded_secret']),
                'insecure_patterns': len([i for i in all_issues if i['type'] == 'insecure_pattern']),
                'file_permissions': len([i for i in all_issues if i['type'] == 'file_permissions']),
                'ssl_issues': len([i for i in all_issues if i['type'] == 'ssl_issue'])
            }
        }
    
    def generate_security_report(self, scan_results: Dict[str, Any]):
        """Generate security audit report"""
        print("🔒 SECURITY AUDIT REPORT")
        print("=" * 50)
        
        print(f"📁 Files Scanned: {scan_results['files_scanned']}")
        print(f"🚨 High Severity Issues: {scan_results['high_severity']}")
        print(f"⚠️ Medium Severity Issues: {scan_results['medium_severity']}")
        print(f"📊 Total Issues Found: {scan_results['total_issues']}")
        
        if scan_results['total_issues'] == 0:
            print("\n🎉 NO SECURITY VULNERABILITIES FOUND!")
            print("✅ Codebase appears secure")
            return True
        
        print("\n📋 ISSUES BY SEVERITY:")
        print("-" * 30)
        
        # Show high severity issues first
        high_issues = [i for i in scan_results['issues'] if i['severity'] == 'HIGH']
        if high_issues:
            print("\n🚨 HIGH SEVERITY:")
            for issue in high_issues:
                print(f"  File: {issue['file']}:{issue['line']}")
                print(f"  Type: {issue['secret_type'] if issue['type'] == 'hardcoded_secret' else issue['issue_type']}")
                print(f"  Content: {issue['content']}")
                print()
        
        # Show medium severity issues
        medium_issues = [i for i in scan_results['issues'] if i['severity'] == 'MEDIUM']
        if medium_issues:
            print("\n⚠️ MEDIUM SEVERITY:")
            for issue in medium_issues:
                print(f"  File: {issue['file']}:{issue['line']}")
                print(f"  Type: {issue['issue_type']}")
                print(f"  Content: {issue['content']}")
                print()
        
        # Summary by category
        print("\n📊 SUMMARY BY CATEGORY:")
        print("-" * 30)
        summary = scan_results['summary']
        for category, count in summary.items():
            if count > 0:
                print(f"  {category.replace('_', ' ').title()}: {count}")
        
        # Security score
        security_score = max(0, 100 - (scan_results['high_severity'] * 10) - (scan_results['medium_severity'] * 5))
        print(f"\n🔒 SECURITY SCORE: {security_score}/100")
        
        if security_score >= 90:
            print("🎉 EXCELLENT security posture")
        elif security_score >= 70:
            print("✅ GOOD security posture")
        elif security_score >= 50:
            print("⚠️ FAIR security posture")
        else:
            print("🚨 POOR security posture")
        
        return security_score >= 70

def main():
    """Main security audit function"""
    try:
        auditor = SecurityAuditor()
        scan_results = auditor.run_security_scan()
        is_secure = auditor.generate_security_report(scan_results)
        
        # Exit with appropriate code
        sys.exit(0 if is_secure else 1)
        
    except Exception as e:
        logger.error(f"Security audit failed: {e}")
        print(f"❌ Security audit failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
