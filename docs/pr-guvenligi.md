# PR ve Master Güvenliği

`master` dalı doğrudan push'a kapatıldı; tüm değişiklikler feature dalı ve Pull Request üzerinden ilerler. Bu belge kuralın kapsamını ve canlı GitHub kanıtını kaydeder.

## 1. Kural

- `master` dalına doğrudan commit/push yapılamaz.
- Her değişiklik `feature/<kisa-ad>` dalında açılır ve PR ile birleştirilir.
- Force push ve dal silme kapalıdır.
- `enforce_admins` açıktır; yönetici hesabı da kurala tabidir.
- PR için en az 0 onay yeterlidir; amaç insan incelemesini zorunlu kılmak değil, doğrudan push'u engellemektir.

## 2. Uygulama

```bash
gh api -X PUT repos/Beratkursun/hello-mobil/branches/master/protection \
  --input protection.json
```

Kullanılan `protection.json`:

```json
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

## 3. Canlı Kanıt

GitHub API yanıtı (21.10.2026):

```json
{
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "enforce_admins": { "enabled": true },
  "required_linear_history": { "enabled": false },
  "allow_force_pushes": { "enabled": false },
  "allow_deletions": { "enabled": false }
}
```

![Master koruması kanıtı](ekran-pr-guvenligi.png)

## 4. PR Akışı

1. `git checkout master && git pull origin master`
2. `git checkout -b feature/<kisa-ad>`
3. Geliştir, `bun run check`, `bun run test`, `bun run build` çalıştır.
4. `git push -u origin feature/<kisa-ad>`
5. `gh pr create --fill --base master`
6. `gh pr diff` ile dosyaları kontrol et.
7. `gh pr merge <no> --merge`

## 5. Not

Ekran görüntüsü, GitHub API'nin canlı yanıtından üretilmiş özet kanıttır; GitHub ayarlar sayfasının görseli değildir. Kural seti API üzerinden doğrulanmıştır.
