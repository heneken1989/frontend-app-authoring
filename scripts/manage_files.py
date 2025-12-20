#!/usr/bin/env python3
"""
Script để quản lý files trong EdX Studio
Có thể add file hoặc remove toàn bộ files từ command line

Usage:
    # Add một file
    python manage_files.py add --course-id "course-v1:org+course+run" --file "path/to/file.jpg"

    # Add nhiều files
    python manage_files.py add --course-id "course-v1:org+course+run" --files "file1.jpg,file2.png"

    # List tất cả files
    python manage_files.py list --course-id "course-v1:org+course+run"

    # Delete tất cả files
    python manage_files.py delete-all --course-id "course-v1:org+course+run"

    # Delete một file cụ thể
    python manage_files.py delete --course-id "course-v1:org+course+run" --asset-id "asset_id_here"
"""

import argparse
import base64
import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Optional

try:
    import requests
except ImportError:
    print("Error: requests library is required. Install it with: pip install requests")
    sys.exit(1)


class EdXFileManager:
    """Quản lý files trong EdX Studio"""

    def __init__(
        self,
        studio_base_url: str,
        auth_token: Optional[str] = None,
        session_cookie: Optional[str] = None,
        client_id: Optional[str] = None,
        client_secret: Optional[str] = None,
    ):
        """
        Khởi tạo EdX File Manager

        Args:
            studio_base_url: URL của Studio (ví dụ: http://localhost:18010)
            auth_token: JWT token (nếu có)
            session_cookie: Session cookie từ browser (nếu có)
            client_id: OAuth2 client ID (để lấy JWT token)
            client_secret: OAuth2 client secret (để lấy JWT token)
        """
        self.studio_base_url = studio_base_url.rstrip('/')
        self.session = requests.Session()

        # Setup authentication
        if auth_token:
            self.session.headers.update({
                'Authorization': f'JWT {auth_token}',
            })
        elif session_cookie:
            self.session.headers.update({
                'Cookie': f'sessionid={session_cookie}',
            })
        elif client_id and client_secret:
            # Lấy JWT token từ OAuth2
            token = self._get_oauth_token(client_id, client_secret)
            self.session.headers.update({
                'Authorization': f'JWT {token}',
            })
        else:
            print("Warning: No authentication provided. You may need to set auth_token, session_cookie, or client_id/secret")

        # Set default headers
        self.session.headers.update({
            'Content-Type': 'application/json',
        })

    def _get_oauth_token(self, client_id: str, client_secret: str) -> str:
        """Lấy JWT token từ OAuth2"""
        credentials = f"{client_id}:{client_secret}"
        encoded = base64.b64encode(credentials.encode()).decode()

        headers = {
            "Authorization": f"Basic {encoded}",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        data = {
            "grant_type": "client_credentials",
            "token_type": "jwt",
        }

        oauth_url = f"{self.studio_base_url}/oauth2/access_token"
        response = requests.post(oauth_url, headers=headers, data=data)
        response.raise_for_status()
        return response.json()["access_token"]

    def get_assets_url(self, course_id: str) -> str:
        """Lấy URL cho assets API"""
        return f"{self.studio_base_url}/assets/{course_id}/"

    def list_files(self, course_id: str, page: int = 0) -> Dict:
        """
        Lấy danh sách files

        Args:
            course_id: Course ID
            page: Page number (mặc định 0)

        Returns:
            Dict chứa assets và totalCount
        """
        url = self.get_assets_url(course_id)
        params = {'page': page}
        
        # Remove Content-Type header for GET request
        headers = {k: v for k, v in self.session.headers.items() if k != 'Content-Type'}
        
        response = self.session.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_all_files(self, course_id: str) -> List[Dict]:
        """
        Lấy tất cả files (tự động paginate)

        Args:
            course_id: Course ID

        Returns:
            List of asset dictionaries
        """
        all_assets = []
        page = 0
        
        while True:
            data = self.list_files(course_id, page)
            assets = data.get('assets', [])
            if not assets:
                break
            
            all_assets.extend(assets)
            
            total_count = data.get('totalCount', 0)
            if len(all_assets) >= total_count:
                break
            
            page += 1
        
        return all_assets

    def add_file(self, course_id: str, file_path: str, is_overwrite: bool = False) -> Dict:
        """
        Upload một file

        Args:
            course_id: Course ID
            file_path: Đường dẫn đến file cần upload
            is_overwrite: Có overwrite file nếu đã tồn tại không

        Returns:
            Dict chứa thông tin asset đã upload
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        url = self.get_assets_url(course_id)
        
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f)}
            
            # Remove Content-Type header để requests tự set multipart/form-data
            headers = {k: v for k, v in self.session.headers.items() 
                      if k not in ['Content-Type']}
            
            response = self.session.post(url, files=files, headers=headers)
            response.raise_for_status()
            return response.json()

    def add_files(self, course_id: str, file_paths: List[str], is_overwrite: bool = False) -> List[Dict]:
        """
        Upload nhiều files

        Args:
            course_id: Course ID
            file_paths: List đường dẫn đến các files
            is_overwrite: Có overwrite file nếu đã tồn tại không

        Returns:
            List of asset dictionaries
        """
        results = []
        for file_path in file_paths:
            try:
                result = self.add_file(course_id, file_path, is_overwrite)
                results.append(result)
                print(f"✅ Uploaded: {os.path.basename(file_path)}")
            except Exception as e:
                print(f"❌ Error uploading {os.path.basename(file_path)}: {e}")
                results.append({'error': str(e), 'file': file_path})
        return results

    def delete_file(self, course_id: str, asset_id: str) -> bool:
        """
        Xóa một file

        Args:
            course_id: Course ID
            asset_id: Asset ID cần xóa

        Returns:
            True nếu thành công
        """
        url = f"{self.get_assets_url(course_id)}{asset_id}"
        
        # Remove Content-Type header for DELETE request
        headers = {k: v for k, v in self.session.headers.items() if k != 'Content-Type'}
        
        response = self.session.delete(url, headers=headers)
        response.raise_for_status()
        return True

    def delete_all_files(self, course_id: str, confirm: bool = False) -> Dict:
        """
        Xóa tất cả files

        Args:
            course_id: Course ID
            confirm: Phải set True để xác nhận xóa

        Returns:
            Dict với thống kê kết quả
        """
        if not confirm:
            raise ValueError("Must set confirm=True to delete all files")

        all_files = self.get_all_files(course_id)
        total = len(all_files)
        deleted = 0
        failed = 0
        errors = []

        print(f"Found {total} files. Starting deletion...")

        for asset in all_files:
            asset_id = asset.get('id')
            display_name = asset.get('display_name', 'Unknown')
            
            try:
                self.delete_file(course_id, asset_id)
                deleted += 1
                print(f"✅ Deleted: {display_name} ({asset_id})")
            except Exception as e:
                failed += 1
                error_msg = f"Failed to delete {display_name}: {e}"
                errors.append(error_msg)
                print(f"❌ {error_msg}")

        return {
            'total': total,
            'deleted': deleted,
            'failed': failed,
            'errors': errors,
        }


def main():
    parser = argparse.ArgumentParser(
        description='Quản lý files trong EdX Studio',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )

    # Common arguments
    parser.add_argument(
        '--studio-url',
        default=os.getenv('STUDIO_BASE_URL', 'http://localhost:18010'),
        help='Studio base URL (default: http://localhost:18010 or $STUDIO_BASE_URL)'
    )
    parser.add_argument(
        '--course-id',
        required=True,
        help='Course ID (ví dụ: course-v1:org+course+run)'
    )
    
    # Authentication options
    auth_group = parser.add_mutually_exclusive_group()
    auth_group.add_argument(
        '--auth-token',
        help='JWT token'
    )
    auth_group.add_argument(
        '--session-cookie',
        help='Session cookie từ browser'
    )
    auth_group.add_argument(
        '--client-id',
        help='OAuth2 client ID'
    )
    parser.add_argument(
        '--client-secret',
        help='OAuth2 client secret (cần khi dùng --client-id)'
    )

    # Subcommands
    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # Add command
    add_parser = subparsers.add_parser('add', help='Add file(s)')
    add_parser.add_argument(
        '--file',
        help='Đường dẫn đến file cần upload'
    )
    add_parser.add_argument(
        '--files',
        help='Danh sách files cách nhau bởi dấu phẩy (ví dụ: file1.jpg,file2.png)'
    )
    add_parser.add_argument(
        '--overwrite',
        action='store_true',
        help='Overwrite file nếu đã tồn tại'
    )

    # List command
    list_parser = subparsers.add_parser('list', help='List all files')

    # Delete command
    delete_parser = subparsers.add_parser('delete', help='Delete a file')
    delete_parser.add_argument(
        '--asset-id',
        required=True,
        help='Asset ID cần xóa'
    )

    # Delete all command
    delete_all_parser = subparsers.add_parser('delete-all', help='Delete all files')
    delete_all_parser.add_argument(
        '--confirm',
        action='store_true',
        required=True,
        help='Xác nhận xóa tất cả files (bắt buộc)'
    )

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Initialize manager
    manager = EdXFileManager(
        studio_base_url=args.studio_url,
        auth_token=args.auth_token,
        session_cookie=args.session_cookie,
        client_id=args.client_id,
        client_secret=args.client_secret,
    )

    try:
        if args.command == 'add':
            file_paths = []
            if args.file:
                file_paths.append(args.file)
            if args.files:
                file_paths.extend([f.strip() for f in args.files.split(',')])
            
            if not file_paths:
                print("Error: Must provide --file or --files")
                sys.exit(1)
            
            results = manager.add_files(args.course_id, file_paths, args.overwrite)
            print(f"\n✅ Uploaded {len([r for r in results if 'error' not in r])} file(s)")

        elif args.command == 'list':
            files = manager.get_all_files(args.course_id)
            print(f"\nFound {len(files)} file(s):\n")
            for asset in files:
                print(f"  - {asset.get('display_name')} (ID: {asset.get('id')})")

        elif args.command == 'delete':
            manager.delete_file(args.course_id, args.asset_id)
            print(f"✅ Deleted asset: {args.asset_id}")

        elif args.command == 'delete-all':
            result = manager.delete_all_files(args.course_id, confirm=args.confirm)
            print(f"\n📊 Summary:")
            print(f"  Total: {result['total']}")
            print(f"  Deleted: {result['deleted']}")
            print(f"  Failed: {result['failed']}")
            if result['errors']:
                print(f"\nErrors:")
                for error in result['errors']:
                    print(f"  - {error}")

    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()

