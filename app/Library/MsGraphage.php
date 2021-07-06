<?php

namespace App\Library;
use Dcblogdev\MsGraph\MsGraph;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class MsGraphage extends MsGraph
{
    public function mime($id)
    {
        return self::guzzleBody('get', '/me/messages/'.$id.'/$value', [], [], auth()->id());
    }

    public function downloadAttachment($id, $attachmentId)
    {
        return self::guzzleBody('get', '/me/messages/'.$id.'/attachments/'.$attachmentId."/\$value", [], [], auth()->id());
    }

    public function mimeFromMessageId($id)
    {
        $results = $this->get("/me/messages?\$filter=internetMessageId eq '".urlencode($id)."'");
        $id = $results['value'][0]['id'];;
        return ['id' => $id, 'mime' => $this->mime($id), 'msgraph' => $results['value'][0], 'attachments' => $this->allAttachments($id)];
    }

    public function allAttachments($id)
    {
        $attachments = $this->get("/me/messages/".$id."/attachments")['value'];
        $results = [];
        foreach($attachments as $attach) {
            $binary = $this->downloadAttachment($id, $attach['id']);
            $results[] = ['filename' => $attach['name'], 'mime_type' => $attach['contentType'], 'contents' => $binary];
        }
        return $results;
    }

    protected function guzzleBody($type, $request, $data = [], $headers = [], $id = null)
    {
        try {
            $client = new Client;

            $mainHeaders = [
                'Authorization' => 'Bearer '.$this->getAccessToken($id),
                'Prefer' => config('msgraph.preferTimezone')
            ];

            if (is_array($headers)) {
                $headers = array_merge($mainHeaders, $headers);
            } else {
                $headers = $mainHeaders;
            }
            $response = $client->$type(self::$baseUrl.$request, [
                'headers' => $headers,
                'body' => json_encode($data),
            ]);

            if ($response == null) {
                return null;
            }
            return $response->getBody()->getContents();

        } catch (ClientException $e) {
            throw new Exception($e->getResponse()->getBody()->getContents());
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

}